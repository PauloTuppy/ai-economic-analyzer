# 🤖 Enhanced AI Economic Advisor v2.0

An advanced AI-powered financial advisory platform, integrating **Gemini 2.5 Pro** for intelligent economic analysis and personalized investment recommendations.

## 🚀 Key Features

### 🧠 **Advanced Artificial Intelligence**
- **Gemini 2.5 Pro Integration**: Deep contextual analysis
- **Streaming Responses**: Real-time responses via WebSocket
- **Context-Aware Analysis**: AI that understands your specific portfolio

### 📊 **Professional Analytics**
- **Value at Risk (VaR)**: Risk calculations with 95% and 99% confidence
- **Stress Testing**: Monte Carlo simulations for economic scenarios
- **Portfolio Optimization**: Optimization algorithms based on MPT
- **Correlation Analysis**: Interactive correlation matrices

### 🌍 **Global Economic Data**
- **Real-Time Market Data**: Updates via WebSocket
- **Economic Indicators**: Brazil, USA, Europe, and emerging markets
- **Market Sentiment**: AI-powered sentiment analysis

### 🏗️ **Enterprise Architecture**
- **Microservices**: Flask + Redis + PostgreSQL
- **Cloud-Native**: Kubernetes ready with auto-scaling
- **High Availability**: Circuit breakers and fallback systems
- **Security**: JWT authentication and audit trails

## 🛠️ Installation and Launch

### Prerequisites
- Docker & Docker Compose
- Google Gemini API Key
- Minimum 4GB RAM
- Ports 5000, 6379, 5432 available

### Quick Launch

```bash
# Clone the repository
git clone https://github.com/your-org/enhanced-ai-economic-advisor.git
cd enhanced-ai-economic-advisor

# Execute the launch script
chmod +x launch.sh
./launch.sh
```

### Manual Configuration

```bash
# 1. Configure environment variables
cp .env.example .env
# Edit .env with your API keys

# 2. Build and start
docker-compose -f docker/docker-compose.yml up -d

# 3. Check health
curl http://localhost:5000/api/health
```

## 📱 User Interface

### Executive Dashboard
- Real-time portfolio metrics
- Interactive performance charts
- Global market overview

### Portfolio Management
- Positions table with live data
- AI-powered portfolio optimizer
- Rebalancing tools

### Economic Analysis
- Global economic indicators
- Trend and correlation analysis
- Alerts for significant changes

### AI Advisor
- Intelligent chat with Gemini 2.5 Pro
- Contextualized recommendations
- Economic scenario analysis

## 🔧 API Endpoints

### Portfolio Management
```http
GET /api/portfolio/metrics
POST /api/portfolio/optimize
POST /api/portfolio/rebalance
```

### AI Consultation
```http
POST /api/ai/query
GET /api/ai/suggestions
```

### Market Data
```http
GET /api/market/data
GET /api/economic/indicators
```

### WebSocket Events
```javascript
// Connect
socket.emit('request_real_time_data')

// Receive updates
socket.on('market_update', (data) => {
    // Process market data
})

socket.on('ai_response_chunk', (data) => {
    // Process streaming AI response
})
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Flask API     │    │   Gemini AI     │
│   React/JS      │◄──►│   + WebSocket   │◄──►│   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌────────┴────────┐
                       │                 │
                ┌──────▼──────┐   ┌──────▼──────┐
                │    Redis    │   │ PostgreSQL  │
                │   Cache     │   │  Database   │
                └─────────────┘   └─────────────┘
```

## 🚀 Production Deployment

### Google Cloud Platform (GKE)
```bash
# 1. Build and push the image
docker build -t gcr.io/your-project/ai-advisor:v2.0 .
docker push gcr.io/your-project/ai-advisor:v2.0

# 2. Deploy to Kubernetes
kubectl apply -f kubernetes/
```

### AWS EKS
```bash
# 1. Configure AWS CLI
aws configure

# 2. Deploy
kubectl apply -f kubernetes/
```

## 📊 Monitoring

### Health Checks
```bash
# Check application health
curl http://localhost:5000/api/health

# Prometheus metrics
curl http://localhost:5000/metrics
```

### Logs
```bash
# Application logs
docker-compose logs -f app

# Redis logs
docker-compose logs -f redis

# PostgreSQL logs
docker-compose logs -f postgres
```

## 🔒 Security

- **JWT Authentication**: Secure tokens for API
- **CORS Protection**: Allowed origins configuration
- **Input Validation**: Input data sanitization
- **Rate Limiting**: Protection against abuse
- **Audit Trails**: Complete transaction log

## 🧪 Tests

```bash
# Unit tests
pytest backend/tests/

# Integration tests
pytest backend/tests/integration/

# Load tests
locust -f tests/load_test.py
```

## 📈 Performance

- **Response Time**: < 200ms for APIs
- **Throughput**: 1000+ requests/second
- **Availability**: 99.9% uptime
- **Scalability**: CPU/Memory-based auto-scaling

## 🤝 Contribution

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.ai-advisor.com](https://docs.ai-advisor.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/enhanced-ai-economic-advisor/issues)
- **