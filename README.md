# 🚀 AI Economic Advisor - Plataforma Completa de Análise Econômica

Uma plataforma profissional de análise econômica e gestão de portfólio com **Inteligência Artificial integrada** e **dados de mercado em tempo real**.

## ✨ Funcionalidades Principais Implementadas

### 🎯 **Interface Completa e Funcional**
- **Dashboard Interativo**: Visão geral do portfólio com métricas em tempo real
- **Gestão de Portfólio**: Análise detalhada de holdings e otimização com IA
- **Análise Econômica**: Indicadores econômicos brasileiros e globais
- **Avaliação de Risco**: Métricas avançadas (VaR, Sharpe, Beta, Sortino)
- **Chat com IA**: Assistente inteligente usando **Gemini AI** real
- **Configurações**: Personalização completa da plataforma

### 🤖 **Integração com IA Real**
- **Gemini AI**: Respostas reais da IA do Google para análises econômicas
- **Hull Tactical Strategy**: Algoritmos avançados de predição de mercado
- **Otimização de Portfólio**: Recomendações de rebalanceamento baseadas em IA
- **Predições de Mercado**: Sistema ensemble com múltiplos modelos de ML
- **Análise de Sentimento**: Processamento de notícias e dados de mercado

### 📊 **Dados de Mercado em Tempo Real**
- **Atualização Automática**: Portfolio atualizado a cada 30 segundos
- **Ações Brasileiras**: PETR4, ITUB3, BIDI4, KNRI11, HGLG11, SNSL3, BCFF11
- **Indicadores Econômicos**: Inflação Brasil (4.2%), Selic (11.75%), USD/BRL (5.12)
- **Métricas de Risco**: VaR 95% (2.3%), Sharpe (0.87), Beta (1.15)

### 🌐 **Sistema Multilíngue Completo**
- **Versão Portuguesa**: Interface completa em português (`index.html`)
- **Versão Inglesa**: Interface completa em inglês (`index-en.html`)
- **Alternador de Idioma**: Troca fácil entre idiomas
- **Localização**: Formatação adequada de moeda, data e números

### 📱 **Design Responsivo e Moderno**
- **Tema Claro/Escuro**: Alternância automática e manual
- **Mobile-First**: Otimizado para todos os dispositivos
- **Animações Suaves**: Transições profissionais entre páginas
- **Glass Morphism**: Efeitos visuais modernos

## 🏗️ **Arquitetura de Microserviços (Bank of Anthos Style)**

### **🏦 Banking Services** (Python Flask)
| Serviço | Porta | Função | Tecnologia |
|---------|-------|--------|------------|
| **User Service** | 5001 | Autenticação JWT + Gestão de usuários | Flask + bcrypt + SQLite |
| **Balance Service** | 5002 | Saldos bancários + Transações financeiras | Flask + SQLite |
| **Transaction Service** | 5003 | Ordens de investimento + Portfolio | Flask + SQLite |

### **📊 Application Services**
| Serviço | Porta | Função | Tecnologia |
|---------|-------|--------|------------|
| **Frontend** | 3002 | Interface SPA + Banking Integration | JavaScript ES6+ / HTML5 / CSS3 |
| **Backend** | 5000 | Dados econômicos + Processamento Excel | Python Flask + Pandas |

### **🔐 Segurança Implementada**
- **JWT Authentication**: Tokens RS256 com expiração de 24h
- **bcrypt**: Criptografia de senhas com salt
- **CORS**: Configuração segura para requisições cross-origin
- **Validação**: Verificação de saldo e holdings antes de transações

### **🌐 Integração Completa**
- **Banking Mode**: `?banking=true` ativa autenticação real
- **Real Transactions**: Compra/venda de ativos com saldo bancário
- **Portfolio Sync**: Sincronização entre dados simulados e reais
- **Transaction History**: Histórico completo de operações

## 🛠️ Tecnologias Utilizadas

### **Frontend** (JavaScript ES6+ / HTML5 / CSS3)
- **Aplicação SPA**: Single Page Application com roteamento
- **Chart.js**: Gráficos interativos profissionais
- **API Integration**: Integração com Gemini AI e APIs de mercado
- **Performance**: Carregamento otimizado e gestão de memória

### **Backend** (Python Flask)
- **API RESTful**: Endpoints para dados econômicos
- **Processamento Excel**: Análise de planilhas financeiras
- **CORS**: Suporte completo para requisições cross-origin
- **Data Processing**: Pandas e NumPy para análise de dados

### **Servidor** (Node.js)
- **HTTP Server**: Servidor otimizado para desenvolvimento
- **Static Files**: Servir arquivos estáticos com MIME types
- **Port Configuration**: Configuração flexível de porta

## 🚀 Como Executar a Plataforma

### **Opção 1: Plataforma Completa com Banking (Recomendado)**
```bash
# Terminal 1 - Serviços Bancários (Bank of Anthos Style)
cd banking-services
pip install -r requirements.txt
python start-services.py

# Terminal 2 - Backend Python
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py

# Terminal 3 - Frontend Node.js
cd frontend
node server.js
```

### **Opção 2: Apenas Frontend + Backend**
```bash
# Terminal 1 - Backend Python
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend Node.js
cd frontend
node server.js
```

### **Opção 3: Apenas Frontend**
```bash
cd frontend
node server.js
# Acesse: http://localhost:3002
```

### **URLs de Acesso**
- **Português**: `http://localhost:3002/` ou `http://localhost:3002/index.html`
- **English**: `http://localhost:3002/index-en.html`
- **Banking Login**: `http://localhost:3002/banking-login.html`
- **Banking Mode**: `http://localhost:3002/?banking=true`
- **Demo Mode**: Adicione `?demo=true` para painel de demonstração interativo

### **🏦 Contas Bancárias de Demonstração**
| Usuário | Senha | Saldo Inicial | Perfil |
|---------|-------|---------------|--------|
| `admin` | `admin123` | R$ 50.000,00 | Administrador |
| `investor` | `investor123` | R$ 25.000,00 | Investidor |
| `trader` | `trader123` | R$ 15.000,00 | Trader |

## 📊 Funcionalidades Detalhadas

### 🎮 **Sistema de Demonstração Interativo**
- **Painel Demo**: Adicione `?demo=true` à URL para ativar
- **Simulação de Mercado**: Teste atualizações de preços em tempo real
- **Predições IA**: Trigger manual para predições de mercado
- **Teste Completo**: Todos os recursos testáveis interativamente

### 📈 **Gráficos e Visualizações**
- **Chart.js Profissional**: Gráficos interativos e animados
- **Portfolio Performance**: Gráficos de linha com histórico
- **Alocação de Ativos**: Gráficos de pizza com percentuais
- **Correlação**: Matriz de correlação entre ativos
- **Indicadores Econômicos**: Visualização de tendências

### 🤖 **Modelos de IA e Machine Learning**
1. **Análise Técnica**: RSI, MACD, Médias Móveis
2. **Análise de Sentimento**: Processamento de notícias e redes sociais
3. **Indicadores Econômicos**: Análise de fatores macroeconômicos
4. **Machine Learning**: Reconhecimento de padrões e métodos ensemble

### 🔍 **Métricas de Risco Avançadas**
- **Value at Risk (VaR 95%)**: 2.3%
- **Sharpe Ratio**: 0.87 (risco-retorno)
- **Sortino Ratio**: 1.23 (downside risk)
- **Beta**: 1.15 (correlação com mercado)
- **Maximum Drawdown**: -8.9%

### 🌐 **Suporte a Navegadores**
- **Chrome 90+** ✅
- **Firefox 88+** ✅
- **Safari 14+** ✅
- **Edge 90+** ✅
- **Progressive Enhancement**: Degradação elegante para navegadores antigos

## 🎯 Como Testar Todas as Funcionalidades

### **1. Navegação Completa**
- ✅ **Dashboard**: Visão geral com métricas em tempo real
- ✅ **Portfolio**: Gestão de holdings com otimização IA
- ✅ **Economic Analysis**: Indicadores econômicos globais
- ✅ **Risk Assessment**: Métricas de risco avançadas
- ✅ **AI Chat**: Chat real com Gemini AI
- ✅ **Settings**: Configurações de risco e preferências

### **2. Recursos Interativos**
- **Otimização IA**: Clique em "AI Optimize" no Portfolio
- **Chat IA**: Faça perguntas no AI Chat (requer API key do Gemini)
- **Alternador de Tema**: Botão de tema claro/escuro
- **Troca de Idioma**: Seletor de idioma (português/inglês)
- **Atualizações em Tempo Real**: Portfolio atualiza a cada 30 segundos

### **3. Dados Reais do Portfolio**
```
Valor Total: R$ 300.727,30
Retorno Total: +18.87%

Holdings:
• PETR4: 3.600 ações - R$ 71.280 (+21.3%)
• ITUB3: 1.100 ações - R$ 88.000 (+82.3%)
• BIDI4: 2.164 ações - R$ 39.818 (-2.5%)
• KNRI11: 180 cotas - R$ 29.430 (-1.1%)
• HGLG11: 220 cotas - R$ 29.304 (-4.5%)
```

### **4. Sistema Bancário Integrado (Bank of Anthos)**
Para testar as funcionalidades bancárias completas:

1. **Inicie os serviços bancários**:
   ```bash
   cd banking-services
   python start-services.py
   ```

2. **Acesse o modo banking**: `http://localhost:3002/?banking=true`

3. **Faça login** com uma das contas de demonstração

4. **Teste as funcionalidades**:
   - ✅ **Saldo Real**: Visualize saldo bancário atualizado
   - ✅ **Compra de Ações**: Execute ordens com saldo real
   - ✅ **Venda de Ações**: Realize vendas e receba o valor
   - ✅ **Histórico**: Acompanhe todas as transações
   - ✅ **Portfolio Real**: Sincronização com holdings bancários

### **5. Configuração da API Gemini (Opcional)**
Para ativar o chat IA real, configure sua API key do Google Gemini:
```javascript
// Em frontend/gemini-integration.js, linha 3:
this.apiKey = 'SUA_API_KEY_AQUI';
```

## 🏆 Status de Implementação

### **🎯 Funcionalidades Core (100% Completo)**
✅ **100% Navegação Funcional** - Todos os botões funcionam perfeitamente  
✅ **Dados de Mercado em Tempo Real** - Atualizações a cada 30 segundos  
✅ **Integração IA** - Gemini AI com respostas reais  
✅ **Predições Avançadas** - Previsões de mercado multi-modelo  
✅ **Dashboard Interativo** - Gráficos e métricas profissionais  
✅ **Sistema Multilíngue** - Versões completas em português e inglês  
✅ **Design Responsivo** - Funciona em todos os dispositivos  
✅ **Interface Profissional** - UI moderna, limpa e intuitiva  
✅ **Performance Otimizada** - Carregamento rápido e animações suaves  
✅ **Sistema Demo** - Teste interativo de funcionalidades  

### **🏦 Sistema Bancário (Bank of Anthos Style - 100% Completo)**
✅ **Microserviços Bancários** - User, Balance e Transaction Services  
✅ **Autenticação JWT** - Login seguro com tokens RS256  
✅ **Saldos Reais** - Gestão de contas bancárias simuladas  
✅ **Transações Reais** - Compra/venda de ativos com saldo bancário  
✅ **Portfolio Integrado** - Sincronização entre dados simulados e reais  
✅ **Histórico Completo** - Rastreamento de todas as operações  
✅ **Interface Banking** - Login e dashboard bancário integrados  
✅ **Validação de Segurança** - Verificação de saldo e holdings  
✅ **Notificações** - Feedback em tempo real das operações  
✅ **Health Monitoring** - Status dos serviços em tempo real  

**O AI Economic Advisor é agora uma plataforma de investimentos totalmente funcional e profissional com capacidades reais de IA, predições de mercado, ferramentas abrangentes de gestão de portfólio E sistema bancário completo estilo Bank of Anthos!** 🎉🏦

## 📞 Suporte e Contribuição

- **Issues**: Reporte bugs ou solicite funcionalidades
- **Pull Requests**: Contribuições são bem-vindas
- **Documentação**: Veja `frontend/FEATURES.md` para lista completa de funcionalidades
- **Licença**: MIT License