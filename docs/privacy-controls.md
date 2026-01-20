# Privacy Controls

Conversation-level privacy controls for PrivGPT Studio.

## Features
- Lock conversations to prevent access
- Auto-delete timers (1h, 24h, 7d, 30d)
- Visual indicators for privacy status
- Automatic cleanup of expired chats

## Usage
1. Click ⋯ menu next to any conversation
2. Select "Privacy Settings"
3. Toggle lock or set auto-delete timer
4. Save changes

## API Endpoints
- `POST /chat/privacy/<session_id>` - Update privacy settings
- `POST /chat/cleanup-expired` - Clean up expired sessions

## Cleanup
Run cleanup script periodically:
```bash
python cleanup_expired_chats.py
# or
curl -X POST http://localhost:5000/chat/cleanup-expired
```