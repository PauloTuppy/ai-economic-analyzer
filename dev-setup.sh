#!/bin/bash

# AI Economic Advisor - Development Setup Script
# Bank of Anthos Style Development Environment

set -e

echo "🚀 AI Economic Advisor - Development Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check pip
    if ! command -v pip &> /dev/null; then
        log_error "pip is not installed"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Setup Python virtual environments
setup_python_env() {
    log_info "Setting up Python virtual environments..."
    
    # Backend environment
    log_info "Setting up backend environment..."
    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    cd ..
    
    # Banking services environment
    log_info "Setting up banking services environment..."
    cd banking-services
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    cd ..
    
    log_success "Python environments setup completed"
}

# Setup Node.js environment
setup_node_env() {
    log_info "Setting up Node.js environment..."
    
    cd frontend
    
    # Check if package.json exists, if not create it
    if [ ! -f "package.json" ]; then
        log_info "Creating package.json..."
        npm init -y
        npm install express cors
    else
        npm install
    fi
    
    cd ..
    
    log_success "Node.js environment setup completed"
}

# Create development configuration files
create_dev_config() {
    log_info "Creating development configuration files..."
    
    # Create .env files for development
    cat > .env.development << EOF
# AI Economic Advisor - Development Configuration

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
EOF

    log_success "Development configuration created"
}

# Create startup scripts
create_startup_scripts() {
    log_info "Creating startup scripts..."
    
    # Create start-all script
    cat > start-all.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting AI Economic Advisor - All Services"
echo "=============================================="

# Function to start service in background
start_service() {
    local service_name=$1
    local command=$2
    local log_file=$3
    
    echo "Starting $service_name..."
    $command > $log_file 2>&1 &
    echo $! > "${service_name}.pid"
    echo "$service_name started (PID: $(cat ${service_name}.pid))"
}

# Create logs directory
mkdir -p logs

# Start banking services
echo "📦 Starting Banking Services..."
cd banking-services
source .venv/bin/activate
start_service "userservice" "python userservice/app.py" "../logs/userservice.log"
start_service "balanceservice" "python balanceservice/app.py" "../logs/balanceservice.log"
start_service "transactionservice" "python transactionservice/app.py" "../logs/transactionservice.log"
cd ..

# Start backend
echo "🐍 Starting Backend..."
cd backend
source .venv/bin/activate
start_service "backend" "python app.py" "../logs/backend.log"
cd ..

# Start frontend
echo "🌐 Starting Frontend..."
cd frontend
start_service "frontend" "node server.js" "../logs/frontend.log"
cd ..

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📊 Service URLs:"
echo "• Frontend:            http://localhost:3002"
echo "• Backend:             http://localhost:5000"
echo "• User Service:        http://localhost:5001"
echo "• Balance Service:     http://localhost:5002"
echo "• Transaction Service: http://localhost:5003"
echo ""
echo "🏦 Banking URLs:"
echo "• Banking Login:       http://localhost:3002/banking-login.html"
echo "• Banking Mode:        http://localhost:3002/?banking=true"
echo ""
echo "📝 Logs are available in the logs/ directory"
echo "🛑 To stop all services, run: ./stop-all.sh"
EOF

    # Create stop-all script
    cat > stop-all.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping AI Economic Advisor - All Services"
echo "============================================="

# Function to stop service
stop_service() {
    local service_name=$1
    local pid_file="${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat $pid_file)
        if kill -0 $pid 2>/dev/null; then
            echo "Stopping $service_name (PID: $pid)..."
            kill $pid
            rm $pid_file
        else
            echo "$service_name is not running"
            rm $pid_file
        fi
    else
        echo "$service_name PID file not found"
    fi
}

# Stop all services
stop_service "frontend"
stop_service "backend"
stop_service "userservice"
stop_service "balanceservice"
stop_service "transactionservice"

echo ""
echo "✅ All services stopped"
EOF

    # Make scripts executable
    chmod +x start-all.sh
    chmod +x stop-all.sh
    
    log_success "Startup scripts created"
}

# Create development database
setup_dev_database() {
    log_info "Setting up development database..."
    
    # Create data directories
    mkdir -p data
    mkdir -p banking-services/userservice/data
    mkdir -p banking-services/balanceservice/data
    mkdir -p banking-services/transactionservice/data
    
    log_success "Development database setup completed"
}

# Main setup function
main() {
    log_info "Starting development environment setup..."
    
    check_prerequisites
    setup_python_env
    setup_node_env
    create_dev_config
    create_startup_scripts
    setup_dev_database
    
    echo ""
    log_success "🎉 Development environment setup completed!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Configure your Gemini API key in .env.development"
    echo "2. Run './start-all.sh' to start all services"
    echo "3. Open http://localhost:3002 in your browser"
    echo "4. Use './stop-all.sh' to stop all services"
    echo ""
    echo "🏦 Banking Demo Accounts:"
    echo "• Admin:    admin / admin123     (R$ 50,000)"
    echo "• Investor: investor / investor123 (R$ 25,000)"
    echo "• Trader:   trader / trader123   (R$ 15,000)"
    echo ""
    echo "📚 Documentation:"
    echo "• README.md - Main documentation"
    echo "• frontend/FEATURES.md - Feature list"
    echo "• banking-services/README.md - Banking services"
}

# Execute main function
main "$@"