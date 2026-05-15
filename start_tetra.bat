@echo off
title Tetra Project Starter
echo Starting Tetra Financial Dashboard...

:: 1. Start the Database
echo [1/3] Starting Database...
powershell -Command "Stop-Process -Name postgres -Force -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Force 'C:\Users\virat\OneDrive\Desktop\Tetra Project\api\pgdata\postmaster.pid' -ErrorAction SilentlyContinue"
start /b "" "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" -D "C:\Users\virat\OneDrive\Desktop\Tetra Project\api\pgdata" -l "C:\Users\virat\OneDrive\Desktop\Tetra Project\api\pg_log_startup.txt" start
timeout /t 3 /nobreak > nul

:: 2. Start the API in a new window
echo [2/3] Launching API Server...
start "Tetra API" cmd /k "cd /d C:\Users\virat\OneDrive\Desktop\Tetra Project\api && npm run dev"

:: 3. Start the Web Frontend in a new window
echo [3/3] Launching Web Frontend...
start "Tetra Web" cmd /k "cd /d C:\Users\virat\OneDrive\Desktop\Tetra Project\web && npm run dev"

echo.
echo All systems launching! 
echo Dashboard will be available at http://localhost:3000
echo.
pause
