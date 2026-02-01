@echo off
echo ========================================
echo Starting AI Resume Analyzer Frontend
echo ========================================
cd frontend

if not exist "node_modules" (
    echo ERROR: Node modules not found!
    echo Please run: npm install
    pause
    exit /b 1
)

echo Starting frontend development server...
echo Frontend will be available at http://localhost:5173
npm run dev
