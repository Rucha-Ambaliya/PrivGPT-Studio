from flask import Blueprint, request, jsonify, Response, current_app
import requests
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from api import gemini_model, mongo
from bson import ObjectId
from api.utils.file_utils import allowed_file, extract_text_from_pdf_bytes
import json
import google.generativeai as genai
from api.config import Config
import jwt
from functools import wraps

def validate_user(req):
    """
    Validates JWT token from request header.
    Returns user_id if valid, else None.
    """
    token = None
    if 'Authorization' in req.headers:
        auth_header = req.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    
    if not token:
        return None
        
    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return data['user_id']
    except:
        return None
    
def has_reached_message_limit(session_id):
    """
    Checks if the session has reached the configured message limit.
    Returns True if limit is reached, False otherwise.
    """
    # New sessions ("1") or invalid IDs don't have history to limit yet
    if session_id == "1" or not session_id or not ObjectId.is_valid(session_id):
        return False
        
    limit = current_app.config.get("MAX_MESSAGES_PER_SESSION", 10)
    
    # Optimization: Fetch only the message roles to minimize data transfer
    session = mongo.db.sessions.find_one(
        {"_id": ObjectId(session_id)},
        {"messages.role": 1} 
    )
    
    if not session:
        return False
        
    # Count only user messages (prompts)
    user_msg_count = sum(1 for m in session.get("messages", []) if m.get("role") == "user")
    
    return user_msg_count >= limit

def save_and_return(session_id, session_name, model_name, user_msg, bot_reply, uploaded_file, file_bytes, user_id=None):
    """
    Saves conversation with file info and returns response JSON.
    
    Returns:
    JSON: Chat response and metadata.
    """
    messages = [
        {
            "role": "user",
            "content": user_msg,
            "timestamp": datetime.now() - timedelta(seconds=10),
            "uploaded_file": {
                "name": uploaded_file.filename,
                "type": uploaded_file.mimetype,
                "size": len(file_bytes),
            },
        },
        {
            "role": "bot",
            "content": bot_reply,
            "timestamp": datetime.now(),
            "model_name": model_name,
        }
    ]

    if session_id != "1":
        mongo.db.sessions.update_one(
            {"_id": ObjectId(session_id)},
            {
                "$push": {"messages": {"$each": messages}},
                "$set": {"session_name": session_name or "How can I help you?"}
            },
        )
    else:
        session_doc = {
            "messages": messages,
            "created_at": datetime.now(),
            "session_name": session_name or "How can I help you?",
            "user_id": user_id 
        }
        inserted = mongo.db.sessions.insert_one(session_doc)
        session_id = str(inserted.inserted_id)
        
        # Add to user's chat list
        if user_id:
             mongo.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"chat_sessions": session_id}}
            )

    return jsonify({
        "response": bot_reply,
        "session_id": session_id,
        "timestamp": messages[1]["timestamp"].isoformat(),
        "latency": 0
    })

def categorize_error(error, model_type="unknown"):
    """
    Categorizes errors and returns appropriate error response.
    Returns: (error_message, http_status_code, error_type)
    """
    error_str = str(error).lower()
    
    # Network connectivity issues
    if "connection refused" in error_str or "connectionreseterror" in error_str:
        return {
            "error": "Unable to connect to AI service. Please check if the local AI server (Ollama) is running.",
            "error_type": "network_connection",
            "suggestion": "Start Ollama server or check your internet connection.",
            "retryable": True
        }, 503
    
    if "timeout" in error_str or "read timeout" in error_str:
        return {
            "error": "Request timed out. The AI service is taking too long to respond.",
            "error_type": "timeout",
            "suggestion": "Try again or switch to a different model.",
            "retryable": True
        }, 504
    
    if "network" in error_str or "unreachable" in error_str:
        return {
            "error": "Network connectivity issue. Please check your internet connection.",
            "error_type": "network_error",
            "suggestion": "Check your network connection and try again.",
            "retryable": True
        }, 503
    
    # Authentication/Authorization issues
    if "unauthorized" in error_str or "invalid api key" in error_str or "authentication" in error_str:
        return {
            "error": "Authentication failed. Please check your API key configuration.",
            "error_type": "auth_error",
            "suggestion": "Verify your API keys in the configuration.",
            "retryable": False
        }, 401
    
    # Rate limiting
    if "rate limit" in error_str or "quota exceeded" in error_str:
        return {
            "error": "API rate limit exceeded. Please wait before making more requests.",
            "error_type": "rate_limit",
            "suggestion": "Wait a few minutes and try again, or switch to a different model.",
            "retryable": True
        }, 429
    
    # Model/service availability
    if "model not found" in error_str or "model unavailable" in error_str:
        return {
            "error": f"The selected {model_type} model is not available.",
            "error_type": "model_unavailable",
            "suggestion": "Choose a different model from the available options.",
            "retryable": False
        }, 400
    
    if "service unavailable" in error_str or "server error" in error_str:
        return {
            "error": "The AI service is temporarily unavailable.",
            "error_type": "service_unavailable",
            "suggestion": "Try again later or use a different model.",
            "retryable": True
        }, 503
    
    # Generic server errors
    if "internal server error" in error_str or "500" in error_str:
        return {
            "error": "Internal server error occurred.",
            "error_type": "server_error",
            "suggestion": "Please try again. If the problem persists, contact support.",
            "retryable": True
        }, 500
    
    # Default fallback
    return {
        "error": f"An unexpected error occurred: {str(error)}",
        "error_type": "unknown_error",
        "suggestion": "Please try again or contact support if the issue persists.",
        "retryable": True
    }, 500

chat_bp = Blueprint('chat_bp', __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    """
    Handles user chat requests, processes messages, optional file input,
    interacts with local or cloud models, and stores conversation in MongoDB.

    Returns:
    JSON: Bot response, session ID, timestamp, and latency.
    """

    try:
        # Validate user
        user_id = validate_user(request)

        # ====== Base form data ======
        user_msg = request.form.get("message", "")
        model_type = request.form.get("model_type", "")
        model_name = request.form.get("model_name", "")
        session_id = request.form.get("session_id", "1")
        session_name = request.form.get("session_name", "")
        user_timestamp = datetime.now() - timedelta(seconds=10)
        session_id = request.form.get("session_id", "1")

        if has_reached_message_limit(session_id):
            return jsonify({
                "error": "Session limit reached. Please start a new chat.",
                "limit_reached": True 
        }), 403

        # ====== Inference Parameters ======
        temperature = float(request.form.get("temperature", 0.7))
        top_p = float(request.form.get("top_p", 0.9))
        top_k = int(request.form.get("top_k", 40))
        max_tokens = int(request.form.get("max_tokens", 2048))
        frequency_penalty = float(request.form.get("frequency_penalty", 0))
        presence_penalty = float(request.form.get("presence_penalty", 0))
        stop_sequence = request.form.get("stop_sequence", "").strip()
        seed_str = request.form.get("seed", "").strip()
        seed = int(seed_str) if seed_str else None
        system_prompt = request.form.get("system_prompt", "").strip()

        # Build generation config for Gemini
        generation_config = {
            "temperature": temperature,
            "top_p": top_p,
            "top_k": top_k,
            "max_output_tokens": max_tokens,
        }
        if stop_sequence:
            generation_config["stop_sequences"] = [stop_sequence]

        # Mentions: fetch context
        mention_session_ids = request.form.getlist("mention_session_ids[]")
        history_context = ""
        if mention_session_ids:
            print(mention_session_ids)
            for m_id in mention_session_ids:
                if ObjectId.is_valid(m_id):
                    s = mongo.db.sessions.find_one({"_id": ObjectId(m_id)})
                    if s:
                        for m in s.get("messages", []):
                            history_context += f"{m['role']}: {m['content']}\n"
        # Handle uploaded file
        if history_context:
            combined_input = (
                f"Here is some previous conversation context that you should consider:\n"
                f"{history_context}\n\n"
                f"Now, based on the above context, here is the user's new message:\n"
                f"{user_msg}"
            )
        else:
            combined_input = user_msg

        # ====== File Handling (optional) ======
        uploaded_file = request.files.get("uploaded_file")
        if uploaded_file:
            if not allowed_file(uploaded_file.filename):
                return jsonify({"error": "Unsupported file type"}), 400
            if uploaded_file.filename == "":
                return jsonify({"error": "Empty file"}), 400

            file_bytes = uploaded_file.read()
            file_ext = uploaded_file.filename.rsplit(".", 1)[-1].lower()

            if model_type == "local":
                return jsonify({"error": "Selected local model does not support files"}), 400
            else:
                # Preprocess file for Gemini
                if file_ext == "pdf":
                    extracted_text = extract_text_from_pdf_bytes(file_bytes)
                    combined_input = f"{combined_input}\n\n[PDF Content Extracted]\n{extracted_text}"
                else:
                    # For image/video/etc, handle as media input
                    # Here gemini_model accepts both text + media
                    response = gemini_model.generate_content(
                        [combined_input, {"mime_type": uploaded_file.mimetype or "image/jpeg", "data": file_bytes}],
                        generation_config=generation_config
                    )
                    latency_ms = 0
                    bot_reply = response.text or "No reply."
                    # Save to DB (with uploaded_file info)
                    return save_and_return(session_id, session_name, model_name, user_msg, bot_reply, uploaded_file,
                                           file_bytes, user_id)

        # ====== Model Handling (text only or text+mentions) ======
        bot_reply = "No reply."
        latency_ms = 0
        fallback_used = False
        if model_type == "local":
            payload = {
                "model": model_name,
                "prompt": combined_input,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "top_p": top_p,
                    "top_k": top_k,
                    "num_predict": max_tokens,
                    "frequency_penalty": frequency_penalty,
                    "presence_penalty": presence_penalty,
                }
            }
            if stop_sequence:
                payload["options"]["stop"] = [stop_sequence]
            if seed is not None:
                payload["options"]["seed"] = seed
            if system_prompt:
                payload["system"] = system_prompt
            try:
                latency_ms = datetime.now()
                response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=60)
                latency_ms = int((datetime.now() - latency_ms).total_seconds() * 1000)
                bot_reply = response.json().get("response", "No reply.")
            except Exception as e:
                # Categorize the error
                error_response, status_code = categorize_error(e, "local")
                return jsonify(error_response), status_code
        else:
            try:
                if model_name == "gemini":
                    print(combined_input)
                    latency_ms = datetime.now()
                    # Use model with system instruction if provided
                    if system_prompt:
                        model_with_system = genai.GenerativeModel(
                            "models/gemini-2.5-flash",
                            system_instruction=system_prompt
                        )
                        response = model_with_system.generate_content(combined_input, generation_config=generation_config)
                    else:
                        response = gemini_model.generate_content(combined_input, generation_config=generation_config)
                    latency_ms = int((datetime.now() - latency_ms).total_seconds() * 1000)
                    bot_reply = response.text or "No Reply"
            except Exception as e:
                error_response, status_code = categorize_error(e, "cloud")
                return jsonify(error_response), status_code

        # ====== Message Format ======
        messages = [
            {"role": "user", "content": user_msg, "timestamp": user_timestamp},
            {"role": "bot", "content": bot_reply, "timestamp": datetime.now(), "model_name": model_name}
        ]

        # save chat history to DB
        if session_id != "1":
            mongo.db.sessions.update_one(
                {"_id": ObjectId(session_id)},
                {"$push": {"messages": {"$each": messages}}},
            )
        else:
            session_doc = {
                "session_name": session_name or "How can I help you?",
                "messages": messages,
                "created_at": datetime.now(),
                "user_id": user_id
            }
            inserted = mongo.db.sessions.insert_one(session_doc)
            session_id = str(inserted.inserted_id)
            
            # Add to user's chat list if logged in
            if user_id:
                mongo.db.users.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$push": {"chat_sessions": session_id}}
                )

        return jsonify({
            "response": bot_reply,
            "session_id": session_id,
            "timestamp": messages[1]["timestamp"].isoformat(),
            "latency": latency_ms,
            "fallback_used": fallback_used,
            "model_name": model_name,
            "model_type": model_type,
        })

    except Exception as e:
        print("Error in /chat:", e)
        return jsonify({"error": str(e)}), 500



@chat_bp.route("/chat/stream", methods=["POST"])
def chat_stream():
    try:
        # Validate user
        user_id = validate_user(request)

        # ====== Base form data ======
        user_msg = request.form.get("message", "")
        model_type = request.form.get("model_type", "")
        model_name = request.form.get("model_name", "")
        session_id = request.form.get("session_id", "1")
        session_name = request.form.get("session_name", "")
        if has_reached_message_limit(session_id):
            def error_generator():
                err_msg = "Session limit reached. Please start a new chat."
                # This matches the error format your frontend expects in line 969 of page.tsx
                yield f"data: {json.dumps({'type': 'error', 'message': err_msg, 'limit_reached': True})}\n\n"
            
            return Response(error_generator(), mimetype='text/event-stream')
        
        user_timestamp = datetime.now() - timedelta(seconds=10)

        # ====== Inference Parameters ======
        temperature = float(request.form.get("temperature", 0.7))
        top_p = float(request.form.get("top_p", 0.9))
        top_k = int(request.form.get("top_k", 40))
        max_tokens = int(request.form.get("max_tokens", 2048))
        frequency_penalty = float(request.form.get("frequency_penalty", 0))
        presence_penalty = float(request.form.get("presence_penalty", 0))
        stop_sequence = request.form.get("stop_sequence", "").strip()
        seed_str = request.form.get("seed", "").strip()
        seed = int(seed_str) if seed_str else None
        system_prompt = request.form.get("system_prompt", "").strip()

        # Build generation config for Gemini
        generation_config = {
            "temperature": temperature,
            "top_p": top_p,
            "top_k": top_k,
            "max_output_tokens": max_tokens,
        }
        if stop_sequence:
            generation_config["stop_sequences"] = [stop_sequence]

        # Mentions: fetch context
        mention_session_ids = request.form.getlist("mention_session_ids[]")
        history_context = ""
        if mention_session_ids:
            print(mention_session_ids)
            for m_id in mention_session_ids:
                if ObjectId.is_valid(m_id):
                    s = mongo.db.sessions.find_one({"_id": ObjectId(m_id)})
                    if s:
                        for m in s.get("messages", []):
                            history_context += f"{m['role']}: {m['content']}\n"
        if history_context:
            combined_input = (
                f"Here is some previous conversation context that you should consider:\n"
                f"{history_context}\n\n"
                f"Now, based on the above context, here is the user's new message:\n"
                f"{user_msg}"
            )
        else:
            combined_input = user_msg
        
        # ====== File Handling (optional) ======
        uploaded_file = request.files.get("uploaded_file")
        if uploaded_file:
            if not allowed_file(uploaded_file.filename):
                return jsonify({"error": "Unsupported file type"}), 400
            if uploaded_file.filename == "":
                return jsonify({"error": "Empty file"}), 400

            file_bytes = uploaded_file.read()
            file_ext = uploaded_file.filename.rsplit(".", 1)[-1].lower()

            if model_type == "local":
                return jsonify({"error": "Selected local model does not support files"}), 400
            else:
                # For file uploads, we'll use non-streaming for now
                if file_ext == "pdf":
                    extracted_text = extract_text_from_pdf_bytes(file_bytes)
                    combined_input = f"{combined_input}\n\n[PDF Content Extracted]\n{extracted_text}"
                else:
                    response = gemini_model.generate_content(
                        [combined_input, {"mime_type": uploaded_file.mimetype or "image/jpeg", "data": file_bytes}],
                        generation_config=generation_config
                    )
                    bot_reply = response.text or "No reply."
                    return save_and_return(session_id, session_name, model_name, user_msg, bot_reply, uploaded_file, file_bytes)

        def generate_stream():
            bot_reply = ""
            start_time = datetime.now()
            
            # Send session info first
            yield f"data: {json.dumps({'type': 'session_info', 'session_id': session_id})}\n\n"
            
            try:
                if model_type == "local":
                    try:
                        payload = {
                            "model": model_name,
                            "prompt": combined_input,
                            "stream": True,
                            "options": {
                                "temperature": temperature,
                                "top_p": top_p,
                                "top_k": top_k,
                                "num_predict": max_tokens,
                                "frequency_penalty": frequency_penalty,
                                "presence_penalty": presence_penalty,
                            }
                        }
                        if stop_sequence:
                            payload["options"]["stop"] = [stop_sequence]
                        if seed is not None:
                            payload["options"]["seed"] = seed
                        if system_prompt:
                            payload["system"] = system_prompt
                        response = requests.post("http://localhost:11434/api/generate", json=payload, stream=True, timeout=60)
                        response.raise_for_status()
                        
                        for line in response.iter_lines():
                            if line:
                                try:
                                    chunk_data = json.loads(line.decode('utf-8'))
                                    chunk_text = chunk_data.get("response", "")
                                    if chunk_text:
                                        bot_reply += chunk_text
                                        yield f"data: {json.dumps({'type': 'chunk', 'text': chunk_text})}\n\n"
                                    
                                    if chunk_data.get("done", False):
                                        break
                                except json.JSONDecodeError:
                                    continue
                                except GeneratorExit:
                                    break
                    except Exception as e:
                        # Categorize the error
                        error_info, _ = categorize_error(e, "local")
                        # For streaming, send error event
                        err_txt = error_info["error"]
                        bot_reply += err_txt
                        yield f"data: {json.dumps({'type': 'error', 'message': err_txt, 'error_type': error_info['error_type'], 'suggestion': error_info['suggestion'], 'retryable': error_info['retryable']})}\n\n"
                                
                else:  # Cloud model (Gemini)
                    if model_name == "gemini":
                        # Gemini streaming
                        # Use model with system instruction if provided
                        if system_prompt:
                            model_with_system = genai.GenerativeModel(
                                "models/gemini-2.5-flash",
                                system_instruction=system_prompt
                            )
                            response = model_with_system.generate_content(
                                combined_input,
                                generation_config=generation_config,
                                stream=True
                            )
                        else:
                            response = gemini_model.generate_content(
                                combined_input,
                                generation_config=generation_config,
                                stream=True
                            )

                        for chunk in response:
                            try:
                                chunk_text = chunk.text if chunk.text else ""
                                if chunk_text:
                                    bot_reply += chunk_text
                                    yield f"data: {json.dumps({'type': 'chunk', 'text': chunk_text})}\n\n"
                            except GeneratorExit:
                                # Handle client disconnect/stop generation
                                break
                    
            except Exception as e:
                error_info, _ = categorize_error(e, model_type)
                error_msg = error_info["error"]
                bot_reply = error_msg
                yield f"data: {json.dumps({'type': 'error', 'message': error_msg, 'error_type': error_info['error_type'], 'suggestion': error_info['suggestion'], 'retryable': error_info['retryable']})}\n\n"
            
            # Calculate latency
            end_time = datetime.now()
            latency_ms = int((end_time - start_time).total_seconds() * 1000)
            
            # Save to database only if we have some content
            if bot_reply.strip():
                messages = [
                    {"role": "user", "content": user_msg, "timestamp": user_timestamp},
                    {"role": "bot", "content": bot_reply, "timestamp": end_time, "model_name": model_name}
                ]

                final_session_id = session_id
                if session_id != "1":
                    mongo.db.sessions.update_one(
                        {"_id": ObjectId(session_id)},
                        {"$push": {"messages": {"$each": messages}}},
                    )
                else:
                    session_doc = {
                        "session_name": session_name or "How can I help you?",
                        "messages": messages,
                        "created_at": datetime.now(),
                        "user_id": user_id
                    }
                    inserted = mongo.db.sessions.insert_one(session_doc)
                    final_session_id = str(inserted.inserted_id)

                    # Add to user's chat list
                    if user_id:
                        mongo.db.users.update_one(
                            {"_id": ObjectId(user_id)},
                            {"$push": {"chat_sessions": final_session_id}}
                        )
                
                # Send completion message
                yield f"data: {json.dumps({'type': 'complete', 'session_id': final_session_id, 'timestamp': end_time.isoformat(), 'latency': latency_ms})}\n\n"

        return Response(
            generate_stream(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Cache-Control'
            }
        )

    except Exception as e:
        print("Error in /chat/stream:", e)
        return jsonify({"error": str(e)}), 500

@chat_bp.route("/chat/history", methods=["POST"])
def chat_history():
    """
    Fetches chat history for given session IDs.

    Returns:
    JSON: List of sessions with message history.
    """
    user_id = validate_user(request)
    
    if user_id:
        # If logged in, fetch sessions from user's list
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user and "chat_sessions" in user:
             # Convert to ObjectIds
             try:
                 user_session_ids = [ObjectId(sid) for sid in user["chat_sessions"] if ObjectId.is_valid(sid)]
                 sessions = mongo.db.sessions.find({"_id": {"$in": user_session_ids}}).sort("created_at", -1)
             except Exception:
                 sessions = []
        else:
            sessions = []
    else:
        # If not logged in, fetch only the requested IDs that DO NOT have a user_id
        # This prevents guests from peeking at user sessions even if they guess an ID
        data = request.json or {}
        id_list = data.get("session_ids", [])
        try:
            object_ids = [ObjectId(sid) for sid in id_list]
        except Exception as e:
            return jsonify({"error": "Invalid session ID format"}), 400
            
        sessions = mongo.db.sessions.find({
            "_id": {"$in": object_ids},
            "user_id": None # Strict check: guest can only see guest chats
        }).sort("created_at", -1)

    result = []
    for session in sessions:
        session["_id"] = str(session["_id"])
        if "user_id" in session:
            session["user_id"] = str(session["user_id"])
            
        for msg in session.get("messages", []):
            if hasattr(msg["timestamp"], "isoformat"):
                msg["timestamp"] = msg["timestamp"].isoformat()
        result.append(session)

    return jsonify(result)
@chat_bp.route("/chat/<session_id>", methods=["GET"])
def get_session_messages(session_id):
    """
    Retrieves all messages for a specific chat session.

    Args:
    session_id (str): MongoDB ObjectId of the session.

    Returns:
    JSON: Session ID and message list or error.
    """
    try:
        session = mongo.db.sessions.find_one({"_id": ObjectId(session_id)})

        if not session:
            return jsonify({"error": "Session not found"}), 404

        # Convert timestamps to ISO format for JSON serialization
        for msg in session.get("messages", []):
            if "timestamp" in msg:
                msg["timestamp"] = msg["timestamp"].isoformat()
        
        limit_reached = has_reached_message_limit(session_id)

        return jsonify({
            "session_id": str(session["_id"]),
            "messages": session["messages"],
            "limit_reached": limit_reached
        })

    except Exception as e:
        return jsonify({"error": f"Invalid session ID: {str(e)}"}), 400

@chat_bp.route("/chat/rename", methods=["POST"])
def rename_session():
    """
    Renames a chat session.

    Returns:
    JSON: Status message indicating success or failure.
    """

    data = request.json or {}
    session_id = data.get("session_id")
    new_name = data.get("new_name")

    if not session_id or not new_name:
        return jsonify({"error": "Missing session_id or new_name"}), 400

    try:
        result = mongo.db.sessions.update_one(
            {"_id": ObjectId(session_id)},
            {"$set": {"session_name": new_name}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Session not found"}), 404

        return jsonify({"message": "Session renamed successfully"})

    except Exception as e:
        return jsonify({"error": f"Failed to rename session: {str(e)}"}), 500
    

@chat_bp.route("/clear", methods=["POST"])
def clear():
    """
    Clears all messages from a chat session.

    Returns:
    JSON: Status and session ID.
    """
    data = request.get_json()
    session_id = data.get("session_id")

    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400

    try:
        result = mongo.db.sessions.update_one(
            {"_id": ObjectId(session_id)},
            {"$set": {"messages": []}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Session not found"}), 404

        return jsonify({"status": "cleared", "session_id": session_id})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route("/chat/delete/<session_id>", methods=["DELETE"])
def delete_chat(session_id):
    """
    Deletes an entire chat session.

    Args:
    session_id (str): MongoDB ObjectId of the session.

    Returns:
    JSON: Status message indicating success or failure.
    """
    try:
        # Validate session_id
        if not ObjectId.is_valid(session_id):
            return jsonify({"error": "Invalid session_id"}), 400

        # Attempt to delete
        result = mongo.db.sessions.delete_one({"_id": ObjectId(session_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Chat session not found"}), 404

        # Remove from any user's chat list
        mongo.db.users.update_many(
            {},
            {"$pull": {"chat_sessions": session_id}}
        )

        return jsonify({"status": "success", "message": "Chat deleted successfully"})
    except Exception as e:
        print("Error in /chat/delete:", e)
        return jsonify({"error": str(e)}), 500
