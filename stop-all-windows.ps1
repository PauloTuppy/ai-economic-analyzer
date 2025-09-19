# AI Economic Advisor - Windows Stop Script
# PowerShell version for Windows users

Write-Host "🛑 AI Economic Advisor - Stopping All Services (Windows)" -ForegroundColor Red
Write-Host "=========================================================" -ForegroundColor Red

# Function to stop service by PID file
function Stop-Service-ByPid {
    param(
        [string]$ServiceName
    )
    
    $pidFile = "$ServiceName.pid"
    
    if (Test-Path $pidFile) {
        $pid = Get-Content $pidFile -ErrorAction SilentlyContinue
        
        if ($pid) {
            try {
                $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "Stopping $ServiceName (PID: $pid)..." -ForegroundColor Yellow
                    Stop-Process -Id $pid -Force
                    Write-Host "$ServiceName stopped" -ForegroundColor Green
                } else {
                    Write-Host "$ServiceName is not running" -ForegroundColor Gray
                }
            }
            catch {
                Write-Host "Error stopping $ServiceName : $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        # Remove PID file
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    } else {
        Write-Host "$ServiceName PID file not found" -ForegroundColor Gray
    }
}

# Function to stop processes by name
function Stop-Service-ByName {
    param(
        [string]$ProcessName,
        [string]$ServiceName
    )
    
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    
    if ($processes) {
        foreach ($process in $processes) {
            # Check if it's one of our services by command line
            try {
                $commandLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($process.Id)").CommandLine
                if ($commandLine -and ($commandLine -like "*app.py*" -or $commandLine -like "*server.js*")) {
                    Write-Host "Stopping $ServiceName (PID: $($process.Id))..." -ForegroundColor Yellow
                    Stop-Process -Id $process.Id -Force
                    Write-Host "$ServiceName stopped" -ForegroundColor Green
                }
            }
            catch {
                # Fallback: stop all matching processes
                Write-Host "Stopping $ServiceName (PID: $($process.Id))..." -ForegroundColor Yellow
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Stop services by PID files first
Write-Host "Stopping services by PID files..." -ForegroundColor Cyan
Stop-Service-ByPid -ServiceName "frontend"
Stop-Service-ByPid -ServiceName "backend"
Stop-Service-ByPid -ServiceName "userservice"
Stop-Service-ByPid -ServiceName "balanceservice"
Stop-Service-ByPid -ServiceName "transactionservice"

# Fallback: stop by process names
Write-Host "`nStopping remaining processes..." -ForegroundColor Cyan
Stop-Service-ByName -ProcessName "python" -ServiceName "Python Services"
Stop-Service-ByName -ProcessName "node" -ServiceName "Node Services"

# Clean up any remaining PID files
Write-Host "`nCleaning up PID files..." -ForegroundColor Cyan
Get-ChildItem -Path "." -Filter "*.pid" | Remove-Item -Force -ErrorAction SilentlyContinue

# Clean up log files if requested
$cleanLogs = Read-Host "`nDo you want to clean log files? (y/N)"
if ($cleanLogs -eq "y" -or $cleanLogs -eq "Y") {
    if (Test-Path "logs") {
        Remove-Item "logs\*" -Force -ErrorAction SilentlyContinue
        Write-Host "Log files cleaned" -ForegroundColor Green
    }
}

Write-Host "`n✅ All services stopped successfully!" -ForegroundColor Green
Write-Host "You can now restart services with: .\start-all-windows.ps1" -ForegroundColor Cyan