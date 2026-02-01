#!/bin/bash

# Resume Analyzer - Complete Setup Script for Linux/macOS
# This script sets up both frontend and backend with authentication

set -e

echo ""
echo "============================================================"
echo "     Resume Analyzer - Complete Setup & Configuration"
echo "============================================================"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "Error: frontend directory not found!"
    echo "Please run this script from the root project directory."
    exit 1
fi

# Step 1: Install Python dependencies
echo "Step 1: Installing Python Backend Dependencies..."
echo ""

cd Bcakend

if [ ! -d "../venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv ../venv
fi

echo "Activating virtual environment..."
source ../venv/bin/activate

echo "Installing requirements..."
pip install -r requirements.txt

echo "✓ Python dependencies installed"
echo ""

# Step 2: Initialize database
echo "Step 2: Initializing Database..."
echo ""

python3 init_db.py

echo "✓ Database initialized"
echo ""

# Step 3: Install Node.js dependencies
echo "Step 3: Installing Frontend Dependencies..."
echo ""

cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
fi

echo "✓ Frontend dependencies installed"
echo ""

# Step 4: Build frontend
echo "Step 4: Building Frontend..."
echo ""

npm run build

echo "✓ Frontend built successfully"
echo ""

# Step 5: Summary and next steps
echo "============================================================"
echo "              Setup Complete! ✓"
echo "============================================================"
echo ""
echo "Configuration Summary:"
echo "====================="
echo ""
echo "Frontend:"
echo " • Location: frontend/"
echo " • Built with: Vite"
echo " • Server: Python HTTP server"
echo " • Port: 3000"
echo " • Build output: frontend/dist/"
echo ""
echo "Backend:"
echo " • Location: Bcakend/"
echo " • Framework: FastAPI"
echo " • Server: Uvicorn"
echo " • Port: 8000"
echo " • Database: SQLite (dev) or PostgreSQL (prod)"
echo ""
echo "Authentication:"
echo " • Signup: User registration with email validation"
echo " • Login: Credential verification"
echo " • Duplicate Check: Prevents multiple accounts with same email"
echo " • Password: Minimum 8 characters, bcrypt hashing"
echo ""
echo "============================================================"
echo "              Starting Servers..."
echo "============================================================"
echo ""

# Start backend
echo "Starting Backend (FastAPI)..."
cd ../Bcakend
source ../venv/bin/activate
python3 run_server.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting Frontend (Python HTTP Server)..."
cd ../frontend
python3 serve.py 3000 &
FRONTEND_PID=$!

echo ""
echo "============================================================"
echo "              Servers Started!"
echo "============================================================"
echo ""
echo "Open your browser:"
echo " • Frontend: http://localhost:3000"
echo " • Backend API: http://localhost:8000"
echo " • API Docs: http://localhost:8000/docs"
echo ""
echo "Test the Application:"
echo " 1. Click 'Sign Up' to create a new account"
echo " 2. Enter email and password (8+ characters)"
echo " 3. Confirm password and sign up"
echo " 4. Use 'Resume Builder' to create your first resume"
echo ""
echo "Database Configuration:"
echo " • SQLite (default): resume_analyzer.db"
echo " • PostgreSQL: Set DATABASE_URL environment variable"
echo ""
echo "Documentation:"
echo " • Authentication: docs/AUTHENTICATION_SETUP.md"
echo " • Setup Guide: docs/SETUP.md"
echo " • Features: docs/FEATURES_GUIDE.md"
echo ""
echo "Process IDs:"
echo " • Backend (PID $BACKEND_PID)"
echo " • Frontend (PID $FRONTEND_PID)"
echo ""
echo "To stop servers:"
echo " • Kill processes: kill $BACKEND_PID $FRONTEND_PID"
echo " • Or press Ctrl+C in terminal"
echo ""

# Keep script running
wait
