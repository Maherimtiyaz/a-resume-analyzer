@echo off
REM Resume Analyzer - Complete Setup Script for Windows
REM This script sets up both frontend and backend with authentication

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo     Resume Analyzer - Complete Setup & Configuration
echo ============================================================
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo Error: frontend directory not found!
    echo Please run this script from the root project directory.
    exit /b 1
)

REM Step 1: Install Python dependencies
echo Step 1: Installing Python Backend Dependencies...
echo.

cd Bcakend
if not exist "..\venv" (
    echo Creating Python virtual environment...
    python -m venv ..\venv
)

echo Activating virtual environment...
call ..\venv\Scripts\activate.bat

echo Installing requirements...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error installing Python dependencies!
    exit /b 1
)

echo ✓ Python dependencies installed
echo.

REM Step 2: Initialize database
echo Step 2: Initializing Database...
echo.

python init_db.py
if errorlevel 1 (
    echo Error initializing database!
    echo Make sure PostgreSQL is running if using PostgreSQL.
    exit /b 1
)

echo ✓ Database initialized
echo.

REM Step 3: Install Node.js dependencies
echo Step 3: Installing Frontend Dependencies...
echo.

cd ..\frontend

if not exist node_modules (
    echo Installing npm packages...
    call npm install
    if errorlevel 1 (
        echo Error installing npm packages!
        exit /b 1
    )
)

echo ✓ Frontend dependencies installed
echo.

REM Step 4: Build frontend
echo Step 4: Building Frontend...
echo.

call npm run build
if errorlevel 1 (
    echo Error building frontend!
    exit /b 1
)

echo ✓ Frontend built successfully
echo.

REM Step 5: Summary and next steps
echo ============================================================
echo              Setup Complete! ✓
echo ============================================================
echo.
echo Configuration Summary:
echo =====================
echo.
echo Frontend:
echo  • Location: frontend/
echo  • Built with: Vite
echo  • Server: Python HTTP server
echo  • Port: 3000
echo  • Build output: frontend/dist/
echo.
echo Backend:
echo  • Location: Bcakend/
echo  • Framework: FastAPI
echo  • Server: Uvicorn
echo  • Port: 8000
echo  • Database: SQLite (dev) or PostgreSQL (prod)
echo.
echo Authentication:
echo  • Signup: User registration with email validation
echo  • Login: Credential verification
echo  • Duplicate Check: Prevents multiple accounts with same email
echo  • Password: Minimum 8 characters, bcrypt hashing
echo.
echo ============================================================
echo              Starting Servers...
echo ============================================================
echo.

REM Start backend
echo Starting Backend (FastAPI)...
cd ..\Bcakend
call ..\venv\Scripts\activate.bat
start "Backend Server" cmd /k "python run_server.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo Starting Frontend (Python HTTP Server)...
cd ..\frontend
start "Frontend Server" cmd /k "python serve.py 3000"

echo.
echo ============================================================
echo              Servers Started!
echo ============================================================
echo.
echo Open your browser:
echo  • Frontend: http://localhost:3000
echo  • Backend API: http://localhost:8000
echo  • API Docs: http://localhost:8000/docs
echo.
echo Test the Application:
echo  1. Click "Sign Up" to create a new account
echo  2. Enter email and password (8+ characters)
echo  3. Confirm password and sign up
echo  4. Use "Resume Builder" to create your first resume
echo.
echo Database Configuration:
echo  • SQLite (default): resume_analyzer.db
echo  • PostgreSQL: Set DATABASE_URL environment variable
echo.
echo Documentation:
echo  • Authentication: docs/AUTHENTICATION_SETUP.md
echo  • Setup Guide: docs/SETUP.md
echo  • Features: docs/FEATURES_GUIDE.md
echo.
echo Troubleshooting:
echo  • Clear browser cache (Ctrl+Shift+Delete)
echo  • Check backend logs in "Backend Server" window
echo  • Check frontend logs in "Frontend Server" window
echo  • Verify ports 3000 and 8000 are available
echo.
echo To stop servers: Close the server windows
echo.

pause
