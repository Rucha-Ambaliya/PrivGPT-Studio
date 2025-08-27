from flask import Flask, request, jsonify, send_file, Response
import requests
from datetime import datetime
import io
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
from flask_pymongo import PyMongo
from bson import ObjectId
from datetime import datetime, timedelta
import fitz
import json
import time

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# --- NEW: Add MAX_PROMPTS constant ---
MAX_PROMPTS = 50  # Static value as per reviewer feedback

# Configure Gemini API using environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# Connect MongoDB using environment variable
MONGODB_URL = os.getenv("MONGODB_URL")
app.config["MONGO_URI"] = MONGODB_URL
mongo = PyMongo(app)

# Reference to the MongoDB collection used to store chat sessions
sessions_collection = mongo.db.sessions

# --- Test MongoDB connection ---
@app.route("/mongo-test")
def mongo_test():
    try:
        count = mongo.db.sessions.count_documents({})
        return f"Connected to MongoDB! Session count: {count}"
    except Exception as e:
        return f"MongoDB connection failed: {str(e)}", 500

# --- Get available models ---
def get_available_models():
    try:
        res = requests.get("http://localhost:11434/api/tags", timeout=5)
        return sorted(set(m['name'].split(":")[0] for m in res.json().get("models", [])))
    except:
        return []

@app.route("/models")
def models():
    local_models = get_available_models()
    cloud_models = ["gemini"]
    return jsonify({
        "local_models": local_models,
        "cloud_models": cloud_models,
    })

# --- Select model ---
@app.route("/select_model", methods=["POST"])
def select_model():
    global current_model
    current_model = request.json.get("model", "phi3")
    return jsonify({"status": "ok"})

# --- Chat endpoint ---
@app.route("/chat", methods=["POST"])
def chat():
    try:
        # --- Base form data ---
        user_msg = request.form.get("message", "")
        model_type = request.form.get("model_type", "")
        model_name = request.form.get("model_name", "")
        session_id = request.form.get("session_id", "1")
        session_name = request.form.get("session_name", "")
        user_timestamp = datetime.now() - timedelta(seconds=10)

        # --- NEW: Check prompt limit ---
        if session_id != "1":
            session = mongo.db.sessions.find_one({"_id": ObjectId(session_id)})
            if session and session.get("prompt_count", 0) >= MAX_PROMPTS:
                return jsonify({"error": f"Maximum prompts per session ({MAX_PROMPTS}) reached"}), 429

        # --- Mentions: fetch context ---
        mention_session_ids = request.form.getlist("mention_session_ids[]")
        history_context = ""
        if mention_session_ids:
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

        # --- File Handling (optional) ---
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
                if file_ext == "pdf":
                    extracted_text = extract_text_from_pdf_bytes(file_bytes)
                    combined_input = f"{combined_input}\n\n[PDF Content Extracted]\n{extracted_text}"
                else:
                    response = gemini_model.generate_content([
                        combined_input,
                        {"mime_type": uploaded_file.mimetype or "image/jpeg", "data": file_bytes}
                    ])
                    bot_reply = response.text or "No reply."
                    return save_and_return(session_id, session_name, model_name, user_msg, bot_reply, uploaded_file, file_bytes)

        # --- Model Handling ---
        bot_reply = "No reply."
        latency_ms = 0
        if model_type == "local":
            payload = {"model": model_name, "prompt": combined_input, "stream": False}
            try:
                latency_ms = datetime.now()
                response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=60)
                latency_ms = int((datetime.now() - latency_ms).total_seconds() * 1000)
                bot_reply = response.json().get("response", "No reply.")
            except Exception as e:
                bot_reply = f"Local model error: {str(e)}"
        else:
            try:
                if model_name == "gemini":
                    latency_ms = datetime.now()
                    response = gemini_model.generate_content(combined_input)
                    latency_ms = int((datetime.now() - latency_ms).total_seconds() * 1000)
                    bot_reply = response.text or "No Reply"
            except Exception as e:
                bot_reply = f"Cloud model error: {str(e)}"

        # --- Message Format ---
        messages = [
            {"role": "user", "content": user_msg, "timestamp": user_timestamp},
            {"role": "bot", "content": bot_reply, "timestamp": datetime.now(), "model_name": model_name}
        ]

        # --- NEW: Increment prompt count ---
        if session_id != "1":
            mongo.db.sessions.update_one(
                {"_id": ObjectId(session_id)},
                {"$push": {"messages": {"$each": messages}}, "$inc": {"prompt_count": 1}}
            )
        else:
            session_doc = {
                "session_name": session_name or "How can I help you?",
                "messages": messages,
                "created_at": datetime.now(),
                "prompt_count": 1  # Initialize prompt count
            }
            inserted = mongo.db.sessions.insert_one(session_doc)
            session_id = str(inserted.inserted_id)

        return jsonify({
            "response": bot_reply,
            "session_id": session_id,
            "timestamp": messages[1]["timestamp"].isoformat(),
            "latency": latency_ms
        })
    except Exception as e:
        print("Error in /chat:", e)
        return jsonify({"error": str(e)}), 500

# --- Chat Stream endpoint ---
@app.route("/chat/stream", methods=["POST"])
def chat_stream():
    try:
        # --- Base form data ---
        user_msg = request.form.get("message", "")
        model_type = request.form.get("model_type", "")
        model_name = request.form.get("model_name", "")
        session_id = request.form.get("session_id", "1")
        session_name = request.form.get("session_name", "")
        user_timestamp = datetime.now() - timedelta(seconds=10)

        # --- NEW: Check prompt limit ---
        if session_id != "1":
            session = mongo.db.sessions.find_one({"_id": ObjectId(session_id)})
            if session and session.get("prompt_count", 0) >= MAX_PROMPTS:
                return jsonify({"error": f"Maximum prompts per session ({MAX_PROMPTS}) reached"}), 429

        # --- Mentions: fetch context ---
        mention_session_ids = request.form.getlist("mention_session_ids[]")
        history_context = ""
        if mention_session_ids:
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

        # --- File Handling (optional) ---
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
                if file_ext == "pdf":
                    extracted_text = extract_text_from_pdf_bytes(file_bytes)
                    combined_input = f"{combined_input}\n\n[PDF Content Extracted]\n{extracted_text}"
                else:
                    response = gemini_model.generate_content([
                        combined_input,
                        {"mime_type": uploaded_file.mimetype or "image/jpeg", "data": file_bytes}
                    ])
                    bot_reply = response.text or "No reply."
                    return save_and_return(session_id, session_name, model_name, user_msg, bot_reply, uploaded_file, file_bytes)

        # --- Stream generation ---
        def generate_stream():
            bot_reply = ""
            start_time = datetime.now()
            yield f"data: {json.dumps({'type': 'session_info', 'session_id': session_id})}\n\n"
            try:
                if model_type == "local":
                    payload = {"model": model_name, "prompt": combined_input, "stream": True}
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
                else:
                    if model_name == "gemini":
                        response = gemini_model.generate_content(combined_input, stream=True)
                        for chunk in response:
                            try:
                                chunk_text = chunk.text if chunk.text else ""
                                if chunk_text:
                                    bot_reply += chunk_text
                                    yield f"data: {json.dumps({'type': 'chunk', 'text': chunk_text})}\n\n"
                            except GeneratorExit:
                                break
            except Exception as e:
                error_msg = f"Error: {str(e)}"
                bot_reply = error_msg
                yield f"data: {json.dumps({'type': 'error', 'message': error_msg})}\n\n"
            end_time = datetime.now()
            latency_ms = int((end_time - start_time).total_seconds() * 1000)
            if bot_reply.strip():
                messages = [
                    {"role": "user", "content": user_msg, "timestamp": user_timestamp},
                    {"role": "bot", "content": bot_reply, "timestamp": end_time, "model_name": model_name}
                ]
                final_session_id = session_id
                if session_id != "1":
                    mongo.db.sessions.update_one(
                        {"_id": ObjectId(session_id)},
                        {"$push": {"messages": {"$each": messages}}, "$inc": {"prompt_count": 1}}
                    )
                else:
                    session_doc = {
                        "session_name": session_name or "How can I help you?",
                        "messages": messages,
                        "created_at": datetime.now(),
                        "prompt_count": 1  # Initialize prompt count
                    }
                    inserted = mongo.db.sessions.insert_one(session_doc)
                    final_session_id = str(inserted.inserted_id)
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

# --- (Rest of your existing endpoints and helper functions remain unchanged) ---
# ... (keep all other endpoints and functions as-is) ...

if __name__ == "__main__":
    app.run(debug=True)
