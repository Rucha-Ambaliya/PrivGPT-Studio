"""
Unit tests for file upload validation and security checks.
"""
import pytest
import os
import sys
from io import BytesIO

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.utils.file_utils import (
    sanitize_filename,
    validate_file_size,
    validate_mime_type,
    validate_file_content,
    allowed_file,
    comprehensive_file_validation
)
from api.config import Config


class TestFilenameSanitization:
    """Test filename sanitization against path traversal attacks."""
    
    def test_basic_filename(self):
        """Test that normal filenames pass through correctly."""
        assert sanitize_filename("document.pdf") == "document.pdf"
        assert sanitize_filename("image.png") == "image.png"
    
    def test_path_traversal_attack(self):
        """Test prevention of path traversal attacks."""
        # Should remove path separators
        result = sanitize_filename("../../etc/passwd")
        assert ".." not in result
        assert "/" not in result
        assert "\\" not in result
    
    def test_null_byte_injection(self):
        """Test prevention of null byte injection."""
        result = sanitize_filename("file\x00.pdf.exe")
        assert "\x00" not in result
    
    def test_long_filename(self):
        """Test that long filenames are truncated."""
        long_name = "a" * 300 + ".pdf"
        result = sanitize_filename(long_name)
        assert len(result) <= 255
    
    def test_special_characters(self):
        """Test handling of special characters."""
        result = sanitize_filename("file name!@#$%^&*().pdf")
        # Should have some safe form
        assert result is not None
        assert len(result) > 0
    
    def test_empty_filename(self):
        """Test handling of empty filename."""
        result = sanitize_filename("")
        assert result == "unnamed_file"


class TestFileSizeValidation:
    """Test file size validation."""
    
    def test_valid_file_size(self):
        """Test that files within size limit are accepted."""
        valid, error = validate_file_size(1024 * 1024)  # 1MB
        assert valid is True
        assert error == ""
    
    def test_file_too_large(self):
        """Test that oversized files are rejected."""
        valid, error = validate_file_size(Config.MAX_FILE_SIZE + 1)
        assert valid is False
        assert "exceeds maximum" in error.lower()
    
    def test_empty_file(self):
        """Test that empty files are rejected."""
        valid, error = validate_file_size(0)
        assert valid is False
        assert "empty" in error.lower()
    
    def test_max_size_boundary(self):
        """Test exact max size boundary."""
        valid, error = validate_file_size(Config.MAX_FILE_SIZE)
        assert valid is True


class TestMimeTypeValidation:
    """Test MIME type validation."""
    
    def test_valid_pdf_mime(self):
        """Test valid PDF MIME type."""
        pdf_bytes = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
        valid, error = validate_mime_type(pdf_bytes, "document.pdf")
        # Should pass (may fall back to extension check if magic not available)
        assert valid is True
    
    def test_invalid_extension(self):
        """Test that invalid extensions are rejected."""
        valid, error = validate_mime_type(b"test", "malicious.exe")
        assert valid is False
        assert "not allowed" in error.lower()
    
    def test_no_extension(self):
        """Test that files without extension are rejected."""
        valid, error = validate_mime_type(b"test", "noextension")
        assert valid is False
        assert "no extension" in error.lower()


class TestFileContentValidation:
    """Test file content validation for malicious files."""
    
    def test_valid_pdf_content(self):
        """Test valid PDF file header."""
        pdf_bytes = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
        valid, error = validate_file_content(pdf_bytes, "pdf")
        assert valid is True
    
    def test_invalid_pdf_content(self):
        """Test invalid PDF without proper header."""
        fake_pdf = b"This is not a PDF"
        valid, error = validate_file_content(fake_pdf, "pdf")
        assert valid is False
        assert "invalid" in error.lower()
    
    def test_executable_signature(self):
        """Test detection of Windows executable signature."""
        exe_bytes = b"MZ" + b"\x00" * 100
        valid, error = validate_file_content(exe_bytes, "pdf")
        assert valid is False
        assert "dangerous" in error.lower()
    
    def test_linux_executable_signature(self):
        """Test detection of Linux executable signature."""
        elf_bytes = b"\x7fELF" + b"\x00" * 100
        valid, error = validate_file_content(elf_bytes, "png")
        assert valid is False
        assert "dangerous" in error.lower()
    
    def test_script_signature(self):
        """Test detection of script files."""
        script_bytes = b"#!/bin/bash\nrm -rf /"
        valid, error = validate_file_content(script_bytes, "txt")
        assert valid is False
        assert "dangerous" in error.lower()
    
    def test_valid_png_content(self):
        """Test valid PNG file header."""
        png_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * 50
        valid, error = validate_file_content(png_bytes, "png")
        assert valid is True
    
    def test_valid_jpeg_content(self):
        """Test valid JPEG file header."""
        jpeg_bytes = b"\xff\xd8\xff" + b"\x00" * 50
        valid, error = validate_file_content(jpeg_bytes, "jpg")
        assert valid is True
    
    def test_valid_gif_content(self):
        """Test valid GIF file header."""
        gif_bytes = b"GIF89a" + b"\x00" * 50
        valid, error = validate_file_content(gif_bytes, "gif")
        assert valid is True


class TestAllowedFile:
    """Test allowed file extension check."""
    
    def test_allowed_extensions(self):
        """Test that allowed extensions return True."""
        assert allowed_file("document.pdf") is True
        assert allowed_file("image.png") is True
        assert allowed_file("photo.jpg") is True
        assert allowed_file("photo.jpeg") is True
        assert allowed_file("animation.gif") is True
    
    def test_disallowed_extensions(self):
        """Test that disallowed extensions return False."""
        assert allowed_file("malware.exe") is False
        assert allowed_file("script.sh") is False
        assert allowed_file("program.bat") is False
    
    def test_case_insensitive(self):
        """Test that extension check is case-insensitive."""
        assert allowed_file("IMAGE.PNG") is True
        assert allowed_file("Document.PDF") is True
    
    def test_no_extension(self):
        """Test that files without extension are rejected."""
        assert allowed_file("noextension") is False
    
    def test_double_extension(self):
        """Test handling of double extensions."""
        # Should only check the last extension
        assert allowed_file("malicious.pdf.exe") is False
        assert allowed_file("document.tar.pdf") is True


class MockFileStream:
    """Mock file stream for testing."""
    
    def __init__(self, content):
        self.content = content
        self.position = 0
    
    def read(self):
        """Read the entire content."""
        return self.content
    
    def seek(self, position):
        """Seek to position."""
        self.position = position


class TestComprehensiveValidation:
    """Test the comprehensive validation function."""
    
    def test_valid_pdf_upload(self):
        """Test valid PDF file upload."""
        pdf_content = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n" + b"0" * 1000
        mock_file = MockFileStream(pdf_content)
        
        result = comprehensive_file_validation(mock_file, "document.pdf")
        
        assert result["valid"] is True
        assert result["error"] is None
        assert result["sanitized_filename"] == "document.pdf"
        assert result["file_bytes"] == pdf_content
        assert result["file_size"] == len(pdf_content)
    
    def test_invalid_extension(self):
        """Test file with invalid extension."""
        mock_file = MockFileStream(b"test content")
        
        result = comprehensive_file_validation(mock_file, "malware.exe")
        
        assert result["valid"] is False
        assert "not allowed" in result["error"].lower()
    
    def test_oversized_file(self):
        """Test file exceeding size limit."""
        large_content = b"A" * (Config.MAX_FILE_SIZE + 1)
        mock_file = MockFileStream(large_content)
        
        result = comprehensive_file_validation(mock_file, "large.pdf")
        
        assert result["valid"] is False
        assert "exceeds maximum" in result["error"].lower()
    
    def test_malicious_content(self):
        """Test file with malicious content (executable signature)."""
        exe_content = b"MZ" + b"\x00" * 1000
        mock_file = MockFileStream(exe_content)
        
        result = comprehensive_file_validation(mock_file, "fake.pdf")
        
        assert result["valid"] is False
        assert "dangerous" in result["error"].lower()
    
    def test_empty_filename(self):
        """Test empty filename handling."""
        mock_file = MockFileStream(b"test")
        
        result = comprehensive_file_validation(mock_file, "")
        
        assert result["valid"] is False
        assert "invalid filename" in result["error"].lower()
    
    def test_path_traversal_in_filename(self):
        """Test path traversal attempt in filename."""
        pdf_content = b"%PDF-1.4\n" + b"0" * 100
        mock_file = MockFileStream(pdf_content)
        
        result = comprehensive_file_validation(mock_file, "../../etc/passwd.pdf")
        
        # Should sanitize the filename
        assert ".." not in result["sanitized_filename"]
        assert "/" not in result["sanitized_filename"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
