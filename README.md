# 🤖 Enhanced AI Economic Advisor v2.0

Uma plataforma avançada de consultoria financeira alimentada por IA, integrando **Gemini 2.5 Pro** para análise econômica inteligente e recomendações de investimento personalizadas.

## 🚀 Características Principais

### 🧠 **Inteligência Artificial Avançada**
- **Gemini 2.5 Pro Integration**: Análise contextual profunda
- **Streaming Responses**: Respostas em tempo real via WebSocket
- **Context-Aware Analysis**: IA que entende seu portfólio específico

### 📊 **Analytics Profissionais**
- **Value at Risk (VaR)**: Cálculos de risco com 95% e 99% de confiança
- **Stress Testing**: Simulações Monte Carlo para cenários econômicos
- **Portfolio Optimization**: Algoritmos de otimização baseados em MPT
- **Correlation Analysis**: Matrizes de correlação interativas

### 🌍 **Dados Econômicos Globais**
- **Real-Time Market Data**: Atualizações via WebSocket
- **Economic Indicators**: Brasil, EUA, Europa e mercados emergentes
- **Market Sentiment**: Análise de sentimento alimentada por IA

### 🏗️ **Arquitetura Enterprise**
- **Microservices**: Flask + Redis + PostgreSQL
- **Cloud-Native**: Kubernetes ready com auto-scaling
- **High Availability**: Circuit breakers e fallback systems
- **Security**: JWT authentication e audit trails

## 🛠️ Instalação e Lançamento

### Pré-requisitos
- Docker & Docker Compose
- Chave API do Google Gemini
- 4GB RAM mínimo
- Portas 5000, 6379, 5432 disponíveis

### Lançamento Rápido

```bash
# Clone o repositório
git clone https://github.com/your-org/enhanced-ai-economic-advisor.git
cd enhanced-ai-economic-advisor

# Execute o script de lançamento
chmod +x launch.sh
./launch.sh
```

### Configuração Manual

```bash
# 1. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas chaves de API

# 2. Build e start
docker-compose -f docker/docker-compose.yml up -d

# 3. Verifique saúde
curl http://localhost:5000/api/health
```

## 📱 Interface do Usuário

### Dashboard Executivo
- Métricas de portfólio em tempo real
- Gráficos interativos de performance
- Visão geral do mercado global

### Gestão de Portfólio
- Tabela de posições com dados ao vivo
- Otimizador de portfólio com IA
- Ferramentas de rebalanceamento

### Análise Econômica
- Indicadores econômicos globais
- Análise de tendências e correlações
- Alertas de mudanças significativas

### Consultor AI
- Chat inteligente com Gemini 2.5 Pro
- Recomendações contextualizadas
- Análise de cenários econômicos

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
// Conectar
socket.emit('request_real_time_data')

// Receber atualizações
socket.on('market_update', (data) => {
    // Processar dados de mercado
})

socket.on('ai_response_chunk', (data) => {
    // Processar resposta streaming da IA
})
```

## 🏗️ Arquitetura

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

## 🚀 Deploy em Produção

### Google Cloud Platform (GKE)
```bash
# 1. Build e push da imagem
docker build -t gcr.io/your-project/ai-advisor:v2.0 .
docker push gcr.io/your-project/ai-advisor:v2.0

# 2. Deploy no Kubernetes
kubectl apply -f kubernetes/
```

### AWS EKS
```bash
# 1. Configure AWS CLI
aws configure

# 2. Deploy
kubectl apply -f kubernetes/
```

## 📊 Monitoramento

### Health Checks
```bash
# Verificar saúde da aplicação
curl http://localhost:5000/api/health

# Métricas Prometheus
curl http://localhost:5000/metrics
```

### Logs
```bash
# Logs da aplicação
docker-compose logs -f app

# Logs do Redis
docker-compose logs -f redis

# Logs do PostgreSQL
docker-compose logs -f postgres
```

## 🔒 Segurança

- **JWT Authentication**: Tokens seguros para API
- **CORS Protection**: Configuração de origens permitidas
- **Input Validation**: Sanitização de dados de entrada
- **Rate Limiting**: Proteção contra abuse
- **Audit Trails**: Log completo de transações

## 🧪 Testes

```bash
# Testes unitários
pytest backend/tests/

# Testes de integração
pytest backend/tests/integration/

# Testes de carga
locust -f tests/load_test.py
```

## 📈 Performance

- **Response Time**: < 200ms para APIs
- **Throughput**: 1000+ requests/segundo
- **Availability**: 99.9% uptime
- **Scalability**: Auto-scaling baseado em CPU/Memory

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Documentação**: [docs.ai-advisor.com](https://docs.ai-advisor.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/enhanced-ai-economic-advisor/issues)
- **