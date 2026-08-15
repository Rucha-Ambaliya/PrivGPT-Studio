import socket
import ipaddress
import requests
from urllib.parse import urlparse

class SSRFError(Exception):
    """Exception raised for SSRF security violations."""
    pass

def is_safe_url(url: str) -> bool:
    """
    Validates if a URL is safe to fetch (prevents SSRF).
    Checks against private/loopback/link-local IP addresses.
    """
    try:
        parsed_url = urlparse(url)
        if parsed_url.scheme not in ("http", "https"):
            raise SSRFError("Only HTTP and HTTPS schemes are allowed.")

        hostname = parsed_url.hostname
        if not hostname:
            raise SSRFError("Invalid URL hostname.")

        # Resolve the hostname to an IP address
        try:
            ip_str = socket.gethostbyname(hostname)
        except socket.gaierror:
            raise SSRFError(f"Could not resolve hostname: {hostname}")

        ip = ipaddress.ip_address(ip_str)

        # Block private, loopback, link-local, and multicast addresses
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast:
            raise SSRFError(f"Access to IP address {ip_str} is forbidden.")

        # Explicitly block AWS metadata endpoint just to be safe
        if ip_str == "169.254.169.254":
            raise SSRFError("Access to cloud metadata endpoints is forbidden.")

        return True

    except ValueError as e:
        raise SSRFError(f"Invalid IP address format: {str(e)}")

def safe_request(url: str, method: str = "GET", timeout: int = 5, **kwargs) -> requests.Response:
    """
    Executes a secure HTTP request that mitigates SSRF attacks.
    Validates the URL before making the request and enforces a strict timeout.
    """
    if is_safe_url(url):
        # Enforce strict timeout
        kwargs["timeout"] = timeout
        return requests.request(method, url, **kwargs)
