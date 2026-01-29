@echo off
title Lancement Projet Laravel + Vite

REM === Chemin du projet ===
cd /d D:\tpm\Topomanager_web

echo ===============================
echo   Lancement du BACKEND
echo ===============================
start cmd /k "php artisan serve"

timeout /t 2 > nul

echo ===============================
echo   Lancement du FRONTEND (Vite)
echo ===============================
start cmd /k "npm run dev"

echo.
echo Projet lance avec succes !
echo.
pause
