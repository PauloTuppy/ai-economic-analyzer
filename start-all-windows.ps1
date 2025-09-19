# AI Economic Advisor - Windows Startup Script
# PowerShell version for Windows users

Write-Host "🚀 AI Economic Advisor - Starting All Services (Windows)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# Function to start service in background
function Start-Service-Background {
    param(
        [string]$ServiceName,
        [string]$Command,
        [string]$WorkingDirectory,
        [string]$LogFile
    )
    
    Write-Host "Starting $ServiceName..." -ForegroundColor Yellow
    
    # Create logs directory if it doesn't exist
    if (!(Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" -Force | Out-Null
    }
    
    # Start the process
    $process = Start-Process -FilePath "powershell" -ArgumentList "-Command", $Command -WorkingDirectory $WorkingDirectory -RedirectStandardOutput $LogFile -RedirectStandardError "$LogFile.error" -PassThru
    
    # Save PID to file
    $process.Id | Out-File -FilePath "$ServiceName.pid" -Encoding ASCII
    
    Write-Host "$ServiceName started (PID: $($process.Id))" -ForegroundColor Green
    
    return $process
}

# Array to store all processes
$processes = @()

try {
    # Start Banking Services
    Write-Host "`n📦 Starting Banking Services..." -ForegroundColor Magenta
    
    # User Service
    $userServiceProcess = Start-Service-Background -ServiceName "userservice" -Command "python userservice/app.py" -WorkingDirectory "banking-services" -LogFile "../logs/userservice.log"
    $processes += $userServiceProcess
    Start-Sleep -Seconds 2
    
    # Balance Service
    $balanceServiceProcess = Start-Service-Background -ServiceName "balanceservice" -Command "python balanceservice/app.py" -WorkingDirectory "banking-services" -LogFile "../logs/balanceservice.log"
    $processes += $balanceServiceProcess
    Start-Sleep -Seconds 2
    
    # Transaction Service
    $transactionServiceProcess = Start-Service-Background -ServiceName "transactionservice" -Command "python transactionservice/app.py" -WorkingDirectory "banking-services" -LogFile "../logs/transactionservice.log"
    $processes += $transactionServiceProcess
    Start-Sleep -Seconds 2
    
    # Backend Service
    Write-Host "`n🐍 Starting Backend..." -ForegroundColor Magenta
    $backendProcess = Start-Service-Background -ServiceName "backend" -Command "python app.py" -WorkingDirectory "backend" -LogFile "../logs/backend.log"
    $processes += $backendProcess
    Start-Sleep -Seconds 2
    
    # Frontend Service
    Write-Host "`n🌐 Starting Frontend..." -ForegroundColor Magenta
    $frontendProcess = Start-Service-Background -ServiceName "frontend" -Command "node server.js" -WorkingDirectory "frontend" -LogFile "../logs/frontend.log"
    $processes += $frontendProcess
    Start-Sleep -Seconds 3
    
    Write-Host "`n✅ All services started successfully!" -ForegroundColor Green
    Write-Host "`n📊 Service URLs:" -ForegroundColor Cyan
    Write-Host "• Frontend:            http://localhost:3002" -ForegroundColor White
    Write-Host "• Backend:             http://localhost:5000" -ForegroundColor White
    Write-Host "• User Service:        http://localhost:5001" -ForegroundColor White
    Write-Host "• Balance Service:     http://localhost:5002" -ForegroundColor White
    Write-Host "• Transaction Service: http://localhost:5003" -ForegroundColor White
    
    Write-Host "`n🏦 Banking URLs:" -ForegroundColor Cyan
    Write-Host "• Banking Login:       http://localhost:3002/banking-login.html" -ForegroundColor White
    Write-Host "• Banking Mode:        http://localhost:3002/?banking=true" -ForegroundColor White
    
    Write-Host "`n🔑 Demo Accounts:" -ForegroundColor Cyan
    Write-Host "• Admin:    admin / admin123     (R$ 50,000)" -ForegroundColor White
    Write-Host "• Investor: investor / investor123 (R$ 25,000)" -ForegroundColor White
    Write-Host "• Trader:   trader / trader123   (R$ 15,000)" -ForegroundColor White
    
    Write-Host "`n📝 Logs are available in the logs/ directory" -ForegroundColor Yellow
    Write-Host "🛑 To stop all services, run: .\stop-all-windows.ps1" -ForegroundColor Yellow
    Write-Host "`nPress Ctrl+C to stop all services..." -ForegroundColor Red
    
    # Wait for user to press Ctrl+C
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    }
    catch {
        Write-Host "`n🛑 Stopping all services..." -ForegroundColor Red
    }
}
finally {
    # Stop all processes
    foreach ($process in $processes) {
        if (!$process.HasExited) {
            Write-Host "Stopping process $($process.Id)..." -ForegroundColor Yellow
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Clean up PID files
    Get-ChildItem -Path "." -Filter "*.pid" | Remove-Item -Force -ErrorAction SilentlyContinue
    
    Write-Host "✅ All services stopped" -ForegroundColor Green
}