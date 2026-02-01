#!/bin/bash
echo "========================================"
echo "Starting AI Resume Analyzer Frontend"
echo "========================================"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "ERROR: Node modules not found!"
    echo "Please run: npm install"
    exit 1
fi

echo "Starting frontend development server..."
echo "Frontend will be available at http://localhost:5173"
npm run dev
