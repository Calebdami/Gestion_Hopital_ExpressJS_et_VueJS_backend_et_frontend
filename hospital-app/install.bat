@echo off
echo 🏥 Hospital Management System - Installation
echo ============================================

cd backend
echo 📦 Installation des dependances backend...
call npm install

cd ..\frontend
echo 📦 Installation des dependances frontend...
call npm install

cd ..
echo ✅ Installation terminée!
echo.
echo Pour démarrer l'application:
echo 1. Terminal 1 - Backend: cd backend ^&^& npm run dev
echo 2. Terminal 2 - Frontend: cd frontend ^&^& npm run dev
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
pause
