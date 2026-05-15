@echo off
title Tetra Project Starter (Cloud DB)
echo Starting Tetra in Cloud Mode...
echo [Local Servers -> Supabase Cloud]
echo.

:: 1. Start the API in a new window
echo [1/2] Launching API Server...
start "Tetra API" cmd /k "cd /d C:\Users\virat\OneDrive\Desktop\Tetra Project\api && npm run dev"

:: 2. Start the Web Frontend in a new window
echo [2/2] Launching Web Frontend...
start "Tetra Web" cmd /k "cd /d C:\Users\virat\OneDrive\Desktop\Tetra Project\web && npm run dev"

echo.
echo All systems launching! 
echo Dashboard: http://localhost:3000
echo Database: Supabase Cloud (tavnxbuiuomhgdthzeky)
echo.
pause
