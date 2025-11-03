@echo off
REM Start the Vite dev server for Avis Fleet project
REM This script opens a new cmd window and runs `npm run dev` from the project root.

:: Change to the directory where this script lives (works across drives)
cd /d "%~dp0"

echo Starting Avis Fleet dev server in a new window...

:: Open a new cmd window and run the dev server (keeps the window open)
start "Avis Fleet Dev" cmd /k "npm run dev"

:: Give the server a moment to start, then open the default browser to the local URL
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173/"

exit /b 0
