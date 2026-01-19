# Privacy Controls Feature

## Overview

PrivGPT Studio now includes conversation-level privacy controls that allow users to:

1. **Lock individual chats** to prevent accidental access or edits
2. **Set auto-expiry timers** (1 hour, 24 hours, 7 days, 30 days) after which chats are automatically deleted
3. **Visual indicators** (lock icon or timer badge) to reflect conversation status

## Features

### Chat Locking
- Locked conversations cannot be accessed or modified
- Visual lock icon appears next to locked conversations
- Attempting to access a locked conversation shows an error message

### Auto-Delete Timers
- Set conversations to automatically delete after a specified time
- Options: 1 hour, 24 hours, 7 days, 30 days
- Timer badge shows remaining time
- Expired conversations are marked and cannot be accessed

### Visual Indicators
- 🔒 Lock icon for locked conversations
- ⏱️ Timer icon with remaining time for auto-delete conversations
- Expired conversations are grayed out and marked as "Expired"

## Usage

### Setting Privacy Controls
1. Click the three-dot menu (⋯) next to any conversation
2. Select "Privacy Settings"
3. Toggle "Lock Conversation" to prevent access/edits
4. Select auto-delete timer from dropdown (Never, 1 Hour, 24 Hours, 7 Days, 30 Days)
5. Click "Save Changes"

### Accessing Privacy-Controlled Conversations
- **Locked conversations**: Show error message when clicked
- **Expired conversations**: Show error message when clicked
- **Active timed conversations**: Work normally but show remaining time

## Backend Implementation

### New Database Fields
Each session document now includes:
```javascript
{
  // ... existing fields
  "privacy_settings": {
    "is_locked": false,
    "auto_delete_after": null, // "1h", "24h", "7d", "30d", or null
    "expires_at": null // ISO timestamp or null
  }
}
```

### New API Endpoints

#### Update Privacy Settings
```
POST /chat/privacy/<session_id>
Content-Type: application/json

{
  "is_locked": true,
  "auto_delete_after": "24h"
}
```

#### Cleanup Expired Chats
```
POST /chat/cleanup-expired
```

### Automatic Cleanup
Run the cleanup script periodically to remove expired conversations:

```bash
# Run every hour via cron
0 * * * * /path/to/server/cleanup_expired_chats.py

# Or run manually
python cleanup_expired_chats.py
```

## Security Considerations

- Locked conversations prevent both viewing and modification
- Expired conversations are automatically removed from the database
- Privacy settings are stored securely in the database
- No sensitive data is exposed in error messages

## Migration

Existing conversations without privacy settings will automatically get default values:
- `is_locked`: false
- `auto_delete_after`: null
- `expires_at`: null

This ensures backward compatibility with existing data.