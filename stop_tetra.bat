@echo off
title Tetra Project Stopper
echo Shutting down Tetra Financial Dashboard...

:: 1. Kill Node.js processes (API and Web)
echo Stopping API and Frontend...
taskkill /F /IM node.exe /T >nul 2>&1

:: 2. Kill PostgreSQL
echo Stopping Database...
taskkill /F /IM postgres.exe /T >nul 2>&1

echo.
echo All systems have been terminated.
echo.
pause
