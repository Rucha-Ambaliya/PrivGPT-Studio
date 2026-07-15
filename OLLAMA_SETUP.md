# Ollama Configuration Guide

This guide explains how to configure your local Ollama instance to work with PrivGPT-Studio, whether you're running the application locally or using a deployed version.

## Overview

PrivGPT-Studio now supports connecting to your local Ollama instance from anywhere. This means you can use your locally installed AI models even when accessing the application through a hosted deployment.

## How It Works

The application uses a backend proxying approach:
- You configure your Ollama instance URL in your profile settings
- The backend validates and tests the connection
- All Ollama requests are proxied through the backend to your configured URL
- If your local Ollama is unreachable, the application gracefully falls back to cloud models (Gemini)

## Configuration Steps

### 1. Set Up Your Local Ollama Instance

First, ensure Ollama is running on your machine:

```bash
# Install Ollama (if not already installed)
# Visit https://ollama.ai for installation instructions

# Start Ollama
ollama serve
```

By default, Ollama runs on `http://localhost:11434`.

### 2. Configure Ollama for Remote Access (Optional)

If you're accessing PrivGPT-Studio from a different machine or network, you'll need to make Ollama accessible:

#### Option A: Expose Ollama to Your Network

```bash
# Start Ollama with network binding
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

Then use your machine's IP address in the URL format: `http://YOUR_IP:11434`

#### Option B: Use a Tunnel (Recommended for Security)

Use a secure tunneling service like ngrok:

```bash
# Install ngrok
# Visit https://ngrok.com for installation instructions

# Create a tunnel to Ollama
ngrok http 11434
```

Use the ngrok URL provided (e.g., `https://random-id.ngrok-free.app`) in your configuration.

### 3. Configure Your Ollama URL in PrivGPT-Studio

1. Navigate to **Settings** (Dashboard)
2. Find the **Ollama URL** field
3. Enter your Ollama instance URL:
   - For local development: `http://localhost:11434`
   - For network access: `http://YOUR_IP:11434`
   - For tunnel access: `https://your-tunnel-url.ngrok-free.app`
4. Click **Test Connection** to verify the setup
5. Click **Save** to save your configuration

### 4. Test the Connection

Use the **Test Connection** button in the settings to verify:
- The URL format is valid
- Ollama is running and accessible
- The backend can reach your Ollama instance

## Security Considerations

### URL Validation
- The backend validates that URLs use `http://` or `https://` protocols only
- URLs are checked for proper format before use

### Recommended Security Practices

1. **Use HTTPS**: Always use HTTPS when exposing Ollama publicly (via tunnels or reverse proxies)
2. **Network Isolation**: Only expose Ollama to trusted networks when possible
3. **Firewall Rules**: Configure firewall rules to limit access to Ollama
4. **Authentication**: Consider adding authentication to your Ollama instance if exposing it publicly
5. **Regular Updates**: Keep Ollama and your tunneling software updated

### What Not To Do

- **Don't** expose Ollama directly to the public internet without authentication
- **Don't** use unsecured HTTP for remote access over the internet
- **Don't** share your Ollama URL publicly

## Graceful Fallback

The application automatically falls back to cloud models (Gemini) when:
- Your local Ollama instance is unreachable
- The connection test fails
- A request to Ollama times out

You'll see indicators in the chat interface showing whether you're using:
- **Local** models (with CPU icon)
- **Cloud** models (with Cloud icon)

## Troubleshooting

### Connection Test Fails

**Problem**: "Connection timeout" or "Connection refused"

**Solutions**:
1. Verify Ollama is running: `curl http://localhost:11434/api/tags`
2. Check your URL format (include `http://` or `https://`)
3. Ensure your firewall allows connections to Ollama
4. If using a tunnel, verify the tunnel is active

**Problem**: "Invalid URL format"

**Solutions**:
1. Ensure URL starts with `http://` or `https://`
2. Check for typos in the URL
3. Remove any trailing slashes

### Models Not Appearing

**Problem**: Local models don't show up in the model selector

**Solutions**:
1. Pull models in Ollama: `ollama pull llama2`
2. Verify models are installed: `ollama list`
3. Test connection in settings
4. Check browser console for errors

### Slow Responses

**Problem**: Responses from local models are slow

**Solutions**:
1. Check your network latency if using remote Ollama
2. Ensure your machine has sufficient resources
3. Try using smaller models
4. Check if Ollama is CPU or GPU constrained

## Advanced Configuration

### Custom Ollama Port

If you're running Ollama on a custom port:

```bash
OLLAMA_HOST=0.0.0.0:11435 ollama serve
```

Then configure your URL as: `http://YOUR_IP:11435`

### Multiple Ollama Instances

You can switch between different Ollama instances by changing the URL in settings. This is useful if you have:
- Different machines with different models
- Test and production Ollama instances
- Shared Ollama instances in a team

## API Reference

### Backend Endpoints

#### Test Ollama Connection
```http
POST /test_ollama
Content-Type: application/json

{
  "ollama_url": "http://localhost:11434"
}
```

Response:
```json
{
  "success": true,
  "message": "Successfully connected to Ollama instance"
}
```

#### Get User Profile (includes Ollama URL)
```http
GET /api/profile
Authorization: Bearer <token>
```

Response:
```json
{
  "username": "user",
  "email": "user@example.com",
  "ollama_url": "http://localhost:11434",
  ...
}
```

#### Update User Profile (includes Ollama URL)
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "ollama_url": "http://localhost:11434"
}
```

## Support

If you encounter issues not covered in this guide:
1. Check the application logs for error messages
2. Verify your Ollama installation with `ollama --version`
3. Test Ollama directly: `curl http://localhost:11434/api/tags`
4. Open an issue on GitHub with detailed error information

## Summary

- Configure your Ollama URL in Settings
- Test the connection before using
- The app falls back to cloud models if local Ollama is unavailable
- Use secure methods (HTTPS, tunnels) for remote access
- Monitor the UI indicators to see which model type is being used
