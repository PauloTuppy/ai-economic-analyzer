#!/bin/bash

# AI Economic Advisor - Kubernetes Deployment Script
# Bank of Anthos Style Deployment

set -e

echo "🚀 AI Economic Advisor - Kubernetes Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="ai-economic-advisor"
REGISTRY="gcr.io/your-project-id"
VERSION="v1.0.0"

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
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "docker is not installed"
        exit 1
    fi
    
    # Check if connected to cluster
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Not connected to a Kubernetes cluster"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Build Docker images
build_images() {
    log_info "Building Docker images..."
    
    # Frontend
    log_info "Building frontend image..."
    docker build -t ${REGISTRY}/frontend:${VERSION} ./frontend/
    
    # Backend
    log_info "Building backend image..."
    docker build -t ${REGISTRY}/backend:${VERSION} ./backend/
    
    # Banking Services
    log_info "Building userservice image..."
    docker build -t ${REGISTRY}/userservice:${VERSION} ./banking-services/userservice/
    
    log_info "Building balanceservice image..."
    docker build -t ${REGISTRY}/balanceservice:${VERSION} ./banking-services/balanceservice/
    
    log_info "Building transactionservice image..."
    docker build -t ${REGISTRY}/transactionservice:${VERSION} ./banking-services/transactionservice/
    
    log_success "All images built successfully"
}

# Push images to registry
push_images() {
    log_info "Pushing images to registry..."
    
    docker push ${REGISTRY}/frontend:${VERSION}
    docker push ${REGISTRY}/backend:${VERSION}
    docker push ${REGISTRY}/userservice:${VERSION}
    docker push ${REGISTRY}/balanceservice:${VERSION}
    docker push ${REGISTRY}/transactionservice:${VERSION}
    
    log_success "All images pushed successfully"
}

# Deploy to Kubernetes
deploy_kubernetes() {
    log_info "Deploying to Kubernetes..."
    
    # Create namespace
    log_info "Creating namespace..."
    kubectl apply -f kubernetes/namespace.yaml
    
    # Apply secrets and config
    log_info "Applying secrets and configuration..."
    kubectl apply -f kubernetes/secrets.yaml
    
    # Deploy services
    log_info "Deploying banking services..."
    kubectl apply -f kubernetes/userservice.yaml
    kubectl apply -f kubernetes/balanceservice.yaml
    kubectl apply -f kubernetes/transactionservice.yaml
    
    log_info "Deploying frontend..."
    kubectl apply -f kubernetes/frontend.yaml
    
    log_success "Deployment completed"
}

# Wait for deployments
wait_for_deployments() {
    log_info "Waiting for deployments to be ready..."
    
    kubectl wait --for=condition=available --timeout=300s deployment/userservice -n ${NAMESPACE}
    kubectl wait --for=condition=available --timeout=300s deployment/balanceservice -n ${NAMESPACE}
    kubectl wait --for=condition=available --timeout=300s deployment/transactionservice -n ${NAMESPACE}
    kubectl wait --for=condition=available --timeout=300s deployment/frontend -n ${NAMESPACE}
    
    log_success "All deployments are ready"
}

# Show deployment status
show_status() {
    log_info "Deployment Status:"
    echo ""
    
    kubectl get pods -n ${NAMESPACE}
    echo ""
    
    kubectl get services -n ${NAMESPACE}
    echo ""
    
    # Get external IP
    EXTERNAL_IP=$(kubectl get service frontend -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    if [ ! -z "$EXTERNAL_IP" ]; then
        log_success "Application is available at: http://${EXTERNAL_IP}"
    else
        log_warning "External IP not yet assigned. Check with: kubectl get service frontend -n ${NAMESPACE}"
    fi
}

# Cleanup function
cleanup() {
    log_info "Cleaning up resources..."
    kubectl delete namespace ${NAMESPACE} --ignore-not-found=true
    log_success "Cleanup completed"
}

# Main execution
main() {
    case "${1:-deploy}" in
        "build")
            check_prerequisites
            build_images
            ;;
        "push")
            check_prerequisites
            push_images
            ;;
        "deploy")
            check_prerequisites
            build_images
            push_images
            deploy_kubernetes
            wait_for_deployments
            show_status
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        *)
            echo "Usage: $0 {build|push|deploy|status|cleanup}"
            echo ""
            echo "Commands:"
            echo "  build   - Build Docker images"
            echo "  push    - Push images to registry"
            echo "  deploy  - Full deployment (build + push + deploy)"
            echo "  status  - Show deployment status"
            echo "  cleanup - Remove all resources"
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"