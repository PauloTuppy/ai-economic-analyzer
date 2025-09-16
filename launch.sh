#!/bin/bash

# Enhanced AI Economic Advisor - Script de Lançamento
# Versão 2.0

set -e

echo "🚀 Lançando Enhanced AI Economic Advisor v2.0"
echo "=============================================="

# Verificar dependências
echo "📋 Verificando dependências..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Instale o Docker Compose primeiro."
    exit 1
fi

# Configurar variáveis de ambiente
echo "⚙️ Configurando variáveis de ambiente..."

if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOF
# Enhanced AI Economic Advisor Configuration
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=$(openssl rand -hex 32)
FLASK_ENV=production
DATABASE_URL=postgresql://advisor:password@postgres:5432/advisor_db
REDIS_URL=redis://redis:6379/0

# Security
JWT_SECRET_KEY=$(openssl rand -hex 32)
CORS_ORIGINS=*

# Monitoring
ENABLE_METRICS=true
LOG_LEVEL=INFO
EOF
    echo "✅ Arquivo .env criado. Configure suas chaves de API!"
fi

# Build da aplicação
echo "🔨 Construindo aplicação..."
docker-compose -f docker/docker-compose.yml build

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose -f docker/docker-compose.yml up -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 10

# Verificar saúde dos serviços
echo "🏥 Verificando saúde dos serviços..."

# Verificar Redis
if docker-compose -f docker/docker-compose.yml exec redis redis-cli ping | grep -q PONG; then
    echo "✅ Redis: OK"
else
    echo "❌ Redis: FALHA"
fi

# Verificar PostgreSQL
if docker-compose -f docker/docker-compose.yml exec postgres pg_isready -U advisor; then
    echo "✅ PostgreSQL: OK"
else
    echo "❌ PostgreSQL: FALHA"
fi

# Verificar aplicação principal
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Aplicação: OK"
else
    echo "❌ Aplicação: FALHA"
fi

# Mostrar status final
echo ""
echo "🎉 Enhanced AI Economic Advisor v2.0 Lançado!"
echo "=============================================="
echo ""
echo "📊 Dashboard: http://localhost:5000"
echo "🔧 API Health: http://localhost:5000/api/health"
echo "📝 Logs: docker-compose -f docker/docker-compose.yml logs -f"
echo ""
echo "🛠️ Comandos úteis:"
echo "  Parar: docker-compose -f docker/docker-compose.yml down"
echo "  Logs: docker-compose -f docker/docker-compose.yml logs -f app"
echo "  Status: docker-compose -f docker/docker-compose.yml ps"
echo ""
echo "⚠️ Lembre-se de configurar sua GEMINI_API_KEY no arquivo .env"
echo ""

# Abrir navegador (opcional)
if command -v xdg-open &> /dev/null; then
    echo "🌐 Abrindo navegador..."
    xdg-open http://localhost:5000
elif command -v open &> /dev/null; then
    echo "🌐 Abrindo navegador..."
    open http://localhost:5000
fi

echo "✨ Lançamento concluído com sucesso!"