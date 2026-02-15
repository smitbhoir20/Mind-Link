#!/usr/bin/env bash
# Script to reset the MindLink database

DB_FILE="backend/mindlink.db"
WAL_FILE="backend/mindlink.db-wal"
SHM_FILE="backend/mindlink.db-shm"

echo "Stopping any running node processes..."
# Try to kill node processes that might have the DB locked
# In a shell environment, this is best effort
# Note: On Windows with Git Bash, this might not work perfectly

echo "Removing database files..."
rm -f "$DB_FILE" "$WAL_FILE" "$SHM_FILE"

if [ ! -f "$DB_FILE" ]; then
    echo "✅ Database reset successful."
    echo "The database will be reinitialized automatically when you start the server."
else
    echo "❌ Failed to remove database files. Please ensure the server is stopped."
fi
