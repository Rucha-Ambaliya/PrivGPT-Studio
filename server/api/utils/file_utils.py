import fitz
import magic
import os
import re
from werkzeug.utils import secure_filename
from api.config import Config

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4', 'pdf', 'mp3'}


def sanitize_filename(filename):
    """
    Sanitizes filename to prevent path traversal attacks.
    
    Args:
    filename (str): Original filename
    
    Returns:
    str: Sanitized filename safe for storage
    """
    if not filename:
        return "unnamed_file"
    
    # Use werkzeug's secure_filename as base
    filename = secure_filename(filename)
    
    # Additional security: remove any remaining path separators
    filename = filename.replace('/', '').replace('\\', '')
    
    # Remove any null bytes
    filename = filename.replace('\x00', '')
    
    # Limit filename length (max 255 chars for most filesystems)
    name, ext = os.path.splitext(filename)
    if len(name) > 200:
        name = name[:200]
    
    return f"{name}{ext}" if ext else name


def validate_file_size(file_size):
    """
    Validates if file size is within allowed limits.
    
    Args:
    file_size (int): Size of file in bytes
    
    Returns:
    tuple: (bool, str) - (is_valid, error_message)
    """
    max_size = Config.MAX_FILE_SIZE
    
    if file_size > max_size:
        max_size_mb = max_size / (1024 * 1024)
        return False, f"File size exceeds maximum allowed size of {max_size_mb:.1f}MB"
    
    if file_size == 0:
        return False, "File is empty"
    
    return True, ""


def validate_mime_type(file_bytes, filename):
    """
    Validates file MIME type using python-magic (libmagic).
    
    Args:
    file_bytes (bytes): File content
    filename (str): File name with extension
    
    Returns:
    tuple: (bool, str) - (is_valid, error_message)
    """
    try:
        # Get file extension
        if '.' not in filename:
            return False, "File has no extension"
        
        file_ext = filename.rsplit('.', 1)[1].lower()
        
        if file_ext not in Config.ALLOWED_EXTENSIONS:
            return False, f"File extension '.{file_ext}' is not allowed"
        
        # Detect actual MIME type from file content
        mime = magic.Magic(mime=True)
        detected_mime = mime.from_buffer(file_bytes)
        
        # Check if detected MIME type matches allowed types for this extension
        allowed_mimes = Config.ALLOWED_MIME_TYPES.get(file_ext, [])
        
        if detected_mime not in allowed_mimes:
            return False, f"File content type '{detected_mime}' does not match extension '.{file_ext}'"
        
        return True, ""
    
    except Exception as e:
        # If python-magic is not available, fall back to extension check only
        print(f"MIME type validation warning: {str(e)}")
        return True, ""  # Allow if magic library fails


def validate_file_content(file_bytes, file_ext):
    """
    Performs basic content validation to detect malicious files.
    
    Args:
    file_bytes (bytes): File content
    file_ext (str): File extension
    
    Returns:
    tuple: (bool, str) - (is_valid, error_message)
    """
    # Check for executable signatures (basic malware detection)
    dangerous_signatures = [
        b'MZ',  # Windows executable
        b'\x7fELF',  # Linux executable
        b'#!/',  # Script files
    ]
    
    for sig in dangerous_signatures:
        if file_bytes.startswith(sig):
            return False, "File contains potentially dangerous content"
    
    # PDF-specific validation
    if file_ext == 'pdf':
        if not file_bytes.startswith(b'%PDF-'):
            return False, "Invalid PDF file structure"
    
    # Image validation (basic header checks)
    elif file_ext == 'png':
        if not file_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
            return False, "Invalid PNG file structure"
    
    elif file_ext in ['jpg', 'jpeg']:
        if not file_bytes.startswith(b'\xff\xd8\xff'):
            return False, "Invalid JPEG file structure"
    
    elif file_ext == 'gif':
        if not (file_bytes.startswith(b'GIF87a') or file_bytes.startswith(b'GIF89a')):
            return False, "Invalid GIF file structure"
    
    return True, ""


def allowed_file(filename):
    """
    Checks if uploaded file has an allowed extension.

    Args:
    filename (str): Name of the uploaded file.

    Returns:
    bool: True if file extension is allowed, else False.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def comprehensive_file_validation(file_stream, filename):
    """
    Performs comprehensive validation on uploaded file.
    
    Args:
    file_stream: Flask file stream object
    filename (str): Original filename
    
    Returns:
    dict: {
        "valid": bool,
        "error": str or None,
        "sanitized_filename": str,
        "file_bytes": bytes or None,
        "file_size": int
    }
    """
    result = {
        "valid": False,
        "error": None,
        "sanitized_filename": None,
        "file_bytes": None,
        "file_size": 0
    }
    
    # Step 1: Sanitize filename
    sanitized_name = sanitize_filename(filename)
    result["sanitized_filename"] = sanitized_name
    
    # Step 2: Check if filename is empty after sanitization
    if not sanitized_name or sanitized_name == "unnamed_file":
        result["error"] = "Invalid filename"
        return result
    
    # Step 3: Check file extension
    if not allowed_file(sanitized_name):
        allowed_exts = ", ".join(ALLOWED_EXTENSIONS)
        result["error"] = f"File type not allowed. Allowed types: {allowed_exts}"
        return result
    
    # Step 4: Read file bytes
    try:
        file_bytes = file_stream.read()
        result["file_bytes"] = file_bytes
        result["file_size"] = len(file_bytes)
    except Exception as e:
        result["error"] = f"Failed to read file: {str(e)}"
        return result
    
    # Step 5: Validate file size
    size_valid, size_error = validate_file_size(len(file_bytes))
    if not size_valid:
        result["error"] = size_error
        return result
    
    # Step 6: Get file extension for further validation
    file_ext = sanitized_name.rsplit('.', 1)[1].lower()
    
    # Step 7: Validate MIME type
    mime_valid, mime_error = validate_mime_type(file_bytes, sanitized_name)
    if not mime_valid:
        result["error"] = mime_error
        return result
    
    # Step 8: Validate file content
    content_valid, content_error = validate_file_content(file_bytes, file_ext)
    if not content_valid:
        result["error"] = content_error
        return result
    
    # All validations passed
    result["valid"] = True
    return result


def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """
    Extracts text content from PDF file bytes.

    Args:
    file_bytes (bytes): PDF file content.

    Returns:
    str: Extracted plain text from PDF.
    """

    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
            text += "\n\n"
    return text.strip()