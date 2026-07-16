@echo off
echo ========================================
echo Prayer Request Manager - Startup Script
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo Installing dependencies (this runs once)...
call npm install

echo.
echo ========================================
echo Starting Development Server in a new window...
echo ========================================
start "Prayer Request Manager" cmd /k "npm run dev"

echo Waiting for the server to start...
timeout /t 3 >nul

echo Opening browser at http://localhost:3000
start "" http://localhost:3000

exit
