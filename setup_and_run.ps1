# AI Document Intelligence Assistant — Setup & Run Script
# Run this in PowerShell: .\setup_and_run.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " AI Document Intelligence Assistant Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Install backend dependencies
Write-Host "[1/4] Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "$root\backend"
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# 2. Install frontend dependencies
Write-Host ""
Write-Host "[2/4] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "$root\frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# 3. Start backend
Write-Host ""
Write-Host "[3/4] Starting backend server (port 8000)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$root\backend`" && uvicorn app.main:app --reload --port 8000" -WindowStyle Normal

# 4. Start frontend
Write-Host "[4/4] Starting frontend dev server (port 5173)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$root\frontend`" && npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " Both servers starting!" -ForegroundColor Green
Write-Host " Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host " Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host " API Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
