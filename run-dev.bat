@echo off
echo Starting MindLink Development Environment...

:: Start Backend
echo Launching Backend (Port 5000)...
start /b cmd /c "cd backend && node server.js"

:: Start Frontend
echo Launching Frontend (Port 3000)...
start /b cmd /c "cd frontend && pnpm run dev"

echo.
echo MindLink is running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C in this window (or close it) to stop.
pause
