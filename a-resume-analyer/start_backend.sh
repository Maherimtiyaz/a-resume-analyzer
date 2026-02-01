#!/bin/bash
echo "========================================"
echo "Starting AI Resume Analyzer Backend"
echo "========================================"
cd Backend

if [ ! -d "venv" ]; then
    echo "ERROR: Virtual environment not found!"
    echo "Please run setup.sh first"
    exit 1
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Starting backend server on http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
