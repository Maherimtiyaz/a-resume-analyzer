@echo off
echo ========================================
echo Starting AI Resume Analyzer Backend
echo ========================================
cd Backend
if not exist "venv" (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Starting backend server on http://localhost:8000
echo API Documentation: http://localhost:8000/docs
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
