# AI Economic Advisor - Docker Start Script for Windows
# PowerShell version for Windows Docker users

Write-Host "🐳 AI Economic Advisor - Docker Deployment (Windows)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Function to check if Docker is running
function Test-DockerRunning {
    try {
        docker version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if Docker Compose is available
function Test-DockerCompose {
    try {
        # Try docker compose (new syntax)
        docker compose version | Out-Null
        return "docker compose"
    }
    catch {
        try {
            # Try docker-compose (old syntax)
            docker-compose version | Out-Null
            return "docker-compose"
        }
        catch {
            return $null
        }
    }
}

# Main function
function Main {
    Write-Host "Checking Docker installation..." -ForegroundColor Yellow
    
    # Check if Docker is installed and running
    if (!(Test-DockerRunning)) {
        Write-Host "❌ Docker is not running or not installed" -ForegroundColor Red
        Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        Write-Host "Make sure Docker Desktop is running before executing this script." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Docker is running" -ForegroundColor Green
    
    # Check Docker Compose
    $composeCommand = Test-DockerCompose
    if (!$composeCommand) {
        Write-Host "❌ Docker Compose is not available" -ForegroundColor Red
        Write-Host "Please install Docker Compose or update Docker Desktop" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Docker Compose is available ($composeCommand)" -ForegroundColor Green
    
    # Check if docker-compose.yml exists
    if (!(Test-Path "docker-compose.yml")) {
        Write-Host "❌ docker-compose.yml not found in current directory" -ForegroundColor Red
        Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "`n🚀 Starting AI Economic Advisor with Docker..." -ForegroundColor Cyan
    
    try {
        # Stop any existing containers
        Write-Host "Stopping existing containers..." -ForegroundColor Yellow
        if ($composeCommand -eq "docker compose") {
            docker compose down
        } else {
            docker-compose down
        }
        
        # Build and start containers
        Write-Host "Building and starting containers..." -ForegroundColor Yellow
        if ($composeCommand -eq "docker compose") {
            docker compose up -d --build
        } else {
            docker-compose up -d --build
        }
        
        Write-Host "`n✅ All containers started successfully!" -ForegroundColor Green
        
        # Wait a moment for services to initialize
        Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Check container status
        Write-Host "`n📊 Container Status:" -ForegroundColor Cyan
        if ($composeCommand -eq "docker compose") {
            docker compose ps
        } else {
            docker-compose ps
        }
        
        Write-Host "`n🌐 Service URLs:" -ForegroundColor Cyan
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
        
        Write-Host "`n📝 Useful Commands:" -ForegroundColor Yellow
        Write-Host "• View logs:     $composeCommand logs -f" -ForegroundColor White
        Write-Host "• Stop services: $composeCommand down" -ForegroundColor White
        Write-Host "• Restart:       $composeCommand restart" -ForegroundColor White
        
        # Test frontend availability
        Write-Host "`n🔍 Testing frontend availability..." -ForegroundColor Yellow
        $maxAttempts = 30
        $attempt = 0
        
        do {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3002" -TimeoutSec 5 -UseBasicParsing
                if ($response.StatusCode -eq 200) {
                    Write-Host "✅ Frontend is responding!" -ForegroundColor Green
                    Write-Host "🎉 You can now access the application at: http://localhost:3002" -ForegroundColor Green
                    break
                }
            }
            catch {
                $attempt++
                if ($attempt -lt $maxAttempts) {
                    Write-Host "Waiting for frontend... (attempt $attempt/$maxAttempts)" -ForegroundColor Gray
                    Start-Sleep -Seconds 2
                } else {
                    Write-Host "⚠️  Frontend may still be starting up. Please check manually." -ForegroundColor Yellow
                    break
                }
            }
        } while ($attempt -lt $maxAttempts)
        
    }
    catch {
        Write-Host "❌ Error starting containers: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please check Docker logs for more information" -ForegroundColor Yellow
        exit 1
    }
}

# Execute main function
Main