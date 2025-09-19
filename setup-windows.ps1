# AI Economic Advisor - Windows Setup Script
# PowerShell version for Windows users

Write-Host "🚀 AI Economic Advisor - Windows Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to log messages with colors
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    switch ($Level) {
        "INFO" { Write-Host "[INFO] $Message" -ForegroundColor Blue }
        "SUCCESS" { Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
        "WARNING" { Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
        "ERROR" { Write-Host "[ERROR] $Message" -ForegroundColor Red }
    }
}

# Check prerequisites
function Test-Prerequisites {
    Write-Log "Checking prerequisites..." "INFO"
    
    $allGood = $true
    
    # Check Python
    if (Test-Command "python") {
        $pythonVersion = python --version 2>&1
        Write-Log "Python found: $pythonVersion" "SUCCESS"
    } else {
        Write-Log "Python is not installed or not in PATH" "ERROR"
        Write-Log "Please install Python from https://python.org" "ERROR"
        $allGood = $false
    }
    
    # Check pip
    if (Test-Command "pip") {
        Write-Log "pip found" "SUCCESS"
    } else {
        Write-Log "pip is not installed or not in PATH" "ERROR"
        $allGood = $false
    }
    
    # Check Node.js
    if (Test-Command "node") {
        $nodeVersion = node --version 2>&1
        Write-Log "Node.js found: $nodeVersion" "SUCCESS"
    } else {
        Write-Log "Node.js is not installed or not in PATH" "ERROR"
        Write-Log "Please install Node.js from https://nodejs.org" "ERROR"
        $allGood = $false
    }
    
    # Check npm
    if (Test-Command "npm") {
        $npmVersion = npm --version 2>&1
        Write-Log "npm found: $npmVersion" "SUCCESS"
    } else {
        Write-Log "npm is not installed or not in PATH" "ERROR"
        $allGood = $false
    }
    
    if ($allGood) {
        Write-Log "Prerequisites check passed" "SUCCESS"
    } else {
        Write-Log "Prerequisites check failed. Please install missing components." "ERROR"
        exit 1
    }
}

# Setup Python virtual environments
function Setup-PythonEnvironments {
    Write-Log "Setting up Python virtual environments..." "INFO"
    
    # Backend environment
    Write-Log "Setting up backend environment..." "INFO"
    Set-Location "backend"
    
    if (!(Test-Path ".venv")) {
        python -m venv .venv
    }
    
    # Activate virtual environment and install dependencies
    & ".venv\Scripts\Activate.ps1"
    pip install -r requirements.txt
    deactivate
    
    Set-Location ".."
    
    # Banking services environment
    Write-Log "Setting up banking services environment..." "INFO"
    Set-Location "banking-services"
    
    if (!(Test-Path ".venv")) {
        python -m venv .venv
    }
    
    # Activate virtual environment and install dependencies
    & ".venv\Scripts\Activate.ps1"
    pip install -r requirements.txt
    deactivate
    
    Set-Location ".."
    
    Write-Log "Python environments setup completed" "SUCCESS"
}

# Setup Node.js environment
function Setup-NodeEnvironment {
    Write-Log "Setting up Node.js environment..." "INFO"
    
    Set-Location "frontend"
    
    # Check if package.json exists, if not create basic one
    if (!(Test-Path "package.json")) {
        Write-Log "Creating package.json..." "INFO"
        
        $packageJson = @{
            name = "ai-economic-advisor-frontend"
            version = "1.0.0"
            description = "AI Economic Advisor Frontend"
            main = "server.js"
            scripts = @{
                start = "node server.js"
                dev = "node server.js"
            }
            dependencies = @{
                express = "^4.18.0"
                cors = "^2.8.5"
            }
        } | ConvertTo-Json -Depth 3
        
        $packageJson | Out-File -FilePath "package.json" -Encoding UTF8
        
        npm install
    } else {
        npm install
    }
    
    Set-Location ".."
    
    Write-Log "Node.js environment setup completed" "SUCCESS"
}

# Create development configuration
function Create-DevConfiguration {
    Write-Log "Creating development configuration..." "INFO"
    
    $envContent = @"
# AI Economic Advisor - Development Configuration (Windows)

# Environment
NODE_ENV=development
FLASK_ENV=development
FLASK_DEBUG=1

# Ports
FRONTEND_PORT=3002
BACKEND_PORT=5000
USER_SERVICE_PORT=5001
BALANCE_SERVICE_PORT=5002
TRANSACTION_SERVICE_PORT=5003

# Security
JWT_SECRET=ai-economic-advisor-dev-secret-key
BCRYPT_ROUNDS=10

# Database
DB_TYPE=sqlite
DB_PATH=./data

# External APIs
GEMINI_API_KEY=your-gemini-api-key-here
MARKET_API_KEY=your-market-api-key-here

# Features
ENABLE_DEMO_MODE=true
ENABLE_GEMINI_AI=true
ENABLE_MARKET_PREDICTIONS=true

# Logging
LOG_LEVEL=DEBUG
"@

    $envContent | Out-File -FilePath ".env.development" -Encoding UTF8
    
    Write-Log "Development configuration created" "SUCCESS"
}

# Create data directories
function Setup-DataDirectories {
    Write-Log "Setting up data directories..." "INFO"
    
    # Create main data directory
    if (!(Test-Path "data")) {
        New-Item -ItemType Directory -Path "data" -Force | Out-Null
    }
    
    # Create banking service data directories
    $bankingDataDirs = @(
        "banking-services\userservice\data",
        "banking-services\balanceservice\data", 
        "banking-services\transactionservice\data"
    )
    
    foreach ($dir in $bankingDataDirs) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    # Create logs directory
    if (!(Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" -Force | Out-Null
    }
    
    Write-Log "Data directories setup completed" "SUCCESS"
}

# Create Windows batch files for easy access
function Create-BatchFiles {
    Write-Log "Creating Windows batch files..." "INFO"
    
    # Create start.bat
    $startBat = @"
@echo off
echo Starting AI Economic Advisor...
powershell -ExecutionPolicy Bypass -File "start-all-windows.ps1"
pause
"@
    $startBat | Out-File -FilePath "start.bat" -Encoding ASCII
    
    # Create stop.bat
    $stopBat = @"
@echo off
echo Stopping AI Economic Advisor...
powershell -ExecutionPolicy Bypass -File "stop-all-windows.ps1"
pause
"@
    $stopBat | Out-File -FilePath "stop.bat" -Encoding ASCII
    
    Write-Log "Batch files created (start.bat, stop.bat)" "SUCCESS"
}

# Main setup function
function Main {
    Write-Log "Starting Windows development environment setup..." "INFO"
    
    try {
        Test-Prerequisites
        Setup-PythonEnvironments
        Setup-NodeEnvironment
        Create-DevConfiguration
        Setup-DataDirectories
        Create-BatchFiles
        
        Write-Host "`n🎉 Windows development environment setup completed!" -ForegroundColor Green
        Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Configure your Gemini API key in .env.development" -ForegroundColor White
        Write-Host "2. Run 'start.bat' or '.\start-all-windows.ps1' to start all services" -ForegroundColor White
        Write-Host "3. Open http://localhost:3002 in your browser" -ForegroundColor White
        Write-Host "4. Use 'stop.bat' or '.\stop-all-windows.ps1' to stop all services" -ForegroundColor White
        
        Write-Host "`n🏦 Banking Demo Accounts:" -ForegroundColor Cyan
        Write-Host "• Admin:    admin / admin123     (R$ 50,000)" -ForegroundColor White
        Write-Host "• Investor: investor / investor123 (R$ 25,000)" -ForegroundColor White
        Write-Host "• Trader:   trader / trader123   (R$ 15,000)" -ForegroundColor White
        
        Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
        Write-Host "• README.md - Main documentation" -ForegroundColor White
        Write-Host "• frontend\FEATURES.md - Feature list" -ForegroundColor White
        Write-Host "• banking-services\README.md - Banking services" -ForegroundColor White
        
        Write-Host "`n🚀 Quick Start:" -ForegroundColor Yellow
        Write-Host "Double-click 'start.bat' to begin!" -ForegroundColor Yellow
        
    }
    catch {
        Write-Log "Setup failed: $($_.Exception.Message)" "ERROR"
        exit 1
    }
}

# Execute main function
Main