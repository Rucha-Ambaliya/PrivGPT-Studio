#!/bin/bash
# Cron job to cleanup expired chats
# Add to crontab: 0 * * * * /path/to/cleanup_cron.sh

curl -X POST http://localhost:5000/chat/cleanup-expired