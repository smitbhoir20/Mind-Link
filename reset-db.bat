@echo off
echo Resetting MindLink Database...

set DB_FILE=backend\mindlink.db
set WAL_FILE=backend\mindlink.db-wal
set SHM_FILE=backend\mindlink.db-shm

if exist %DB_FILE% (
    del /f /q %DB_FILE%
    if exist %DB_FILE% (
        echo ❌ Failed to remove %DB_FILE%. Ensure the server is stopped.
    ) else (
        echo ✅ Removed: %DB_FILE%
    )
)

if exist %WAL_FILE% del /f /q %WAL_FILE%
if exist %SHM_FILE% del /f /q %SHM_FILE%

if not exist %DB_FILE% (
    echo.
    echo ✅ Database reset successful.
    echo The database will be reinitialized automatically when you next start the server.
) else (
    echo.
    echo ❌ Database reset failed.
)

pause
