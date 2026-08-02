@echo off
echo ============================================
echo  AI Document Intelligence Assistant Setup
echo ============================================
echo.

echo [1/4] Installing backend dependencies...
cd /d "%~dp0backend"
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Starting backend server (port 8000)...
cd /d "%~dp0backend"
start "Backend" cmd /k "uvicorn app.main:app --reload --port 8000"

echo [4/4] Starting frontend dev server (port 5173)...
cd /d "%~dp0frontend"
start "Frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo  Both servers starting!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo ============================================
echo.
pause
