# start-project.ps1

Write-Host "--- Starting SkillStation Project Setup ---" -ForegroundColor Cyan

# Kill existing node processes to prevent port conflicts
Write-Host "Cleaning up existing node processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe /T 2>$null

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# Start Frontend
Write-Host "Starting Frontend Client..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "Both services are starting in new windows." -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
