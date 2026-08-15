import pytest
import requests
from api.utils.ssrf_filter import is_safe_url, safe_request, SSRFError

def test_safe_url():
    assert is_safe_url("https://www.google.com") == True

def test_local_ip_blocked():
    with pytest.raises(SSRFError) as excinfo:
        is_safe_url("http://127.0.0.1/api")
    assert "forbidden" in str(excinfo.value)

def test_metadata_endpoint_blocked():
    with pytest.raises(SSRFError) as excinfo:
        is_safe_url("http://169.254.169.254/latest/meta-data/")
    assert "forbidden" in str(excinfo.value)

def test_private_network_blocked():
    with pytest.raises(SSRFError) as excinfo:
        is_safe_url("http://192.168.1.100/admin")
    assert "forbidden" in str(excinfo.value)

def test_safe_request_success(monkeypatch):
    class MockResponse:
        status_code = 200
        text = "Success"
        
    def mock_request(*args, **kwargs):
        return MockResponse()
        
    monkeypatch.setattr(requests, "request", mock_request)
    
    response = safe_request("https://example.com")
    assert response.status_code == 200
    assert response.text == "Success"
