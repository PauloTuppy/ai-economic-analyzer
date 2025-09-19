# 🏦 Banking Services - Bank of Anthos Style

Microserviços bancários integrados ao AI Economic Advisor, seguindo o padrão do Google Cloud Bank of Anthos.

## 🚀 Arquitetura de Microserviços

### **User Service** (Porta 5001)
- **Função**: Autenticação e gestão de usuários
- **Tecnologia**: Python Flask + JWT + bcrypt
- **Endpoints**:
  - `POST /login` - Autenticação de usuários
  - `GET /user/<account_number>` - Dados do usuário
  - `GET /health` - Health check

### **Balance Service** (Porta 5002)
- **Função**: Gestão de saldos e transações bancárias
- **Tecnologia**: Python Flask + SQLite
- **Endpoints**:
  - `GET /balance/<account_number>` - Consultar saldo
  - `POST /withdraw` - Sacar fundos para investimentos
  - `POST /deposit` - Depositar retornos de investimentos
  - `GET /transactions/<account_number>` - Histórico de transações

### **Transaction Service** (Porta 5003)
- **Função**: Execução de ordens de investimento
- **Tecnologia**: Python Flask + SQLite
- **Endpoints**:
  - `POST /buy` - Comprar ativos
  - `POST /sell` - Vender ativos
  - `GET /portfolio/<account_number>` - Portfolio do usuário
  - `GET /orders/<account_number>` - Histórico de ordens

## 🔧 Como Executar

### **Opção 1: Script Automático (Recomendado)**
```bash
cd banking-services
python -m pip install -r requirements.txt
python start-services.py
```

### **Opção 2: Serviços Individuais**
```bash
# Terminal 1 - User Service
cd banking-services/userservice
python app.py

# Terminal 2 - Balance Service  
cd banking-services/balanceservice
python app.py

# Terminal 3 - Transaction Service
cd banking-services/transactionservice
python app.py
```

### **Opção 3: Docker (Futuro)**
```bash
cd banking-services
docker-compose up -d
```

## 🔑 Contas de Demonstração

| Usuário | Senha | Saldo Inicial | Perfil |
|---------|-------|---------------|--------|
| `admin` | `admin123` | R$ 50.000,00 | Administrador |
| `investor` | `investor123` | R$ 25.000,00 | Investidor |
| `trader` | `trader123` | R$ 15.000,00 | Trader |

## 🌐 URLs de Acesso

### **Serviços Backend**
- **User Service**: http://localhost:5001
- **Balance Service**: http://localhost:5002
- **Transaction Service**: http://localhost:5003

### **Frontend Integrado**
- **Login Bancário**: http://localhost:3002/banking-login.html
- **Dashboard com Banking**: http://localhost:3002/?banking=true

## 🔐 Segurança Implementada

### **Autenticação JWT**
- Tokens RS256 com expiração de 24 horas
- Headers Authorization obrigatórios
- Validação em todos os endpoints protegidos

### **Criptografia de Senhas**
- bcrypt com salt para hash de senhas
- Armazenamento seguro no banco de dados

### **Validação de Transações**
- Verificação de saldo antes de saques
- Validação de holdings antes de vendas
- Logs de auditoria para todas as transações

## 📊 Fluxo de Investimento

### **1. Autenticação**
```javascript
const result = await bankingService.login('investor', 'investor123');
// Retorna: { token, user: { account_number, balance, ... } }
```

### **2. Consulta de Saldo**
```javascript
const balance = await bankingService.getBalance();
// Retorna: { balance: 25000.00, available_balance: 25000.00 }
```

### **3. Compra de Ativo**
```javascript
const purchase = await bankingService.buyAsset('PETR4', 100, 20.50);
// Executa: Saque automático + Atualização do portfolio
```

### **4. Venda de Ativo**
```javascript
const sale = await bankingService.sellAsset('PETR4', 50, 22.00);
// Executa: Depósito automático + Atualização do portfolio
```

## 🎯 Integração com Frontend

### **Modo Banking Ativado**
- URL: `?banking=true` ativa o modo bancário
- Redirecionamento automático para login se não autenticado
- Painel bancário no dashboard com saldo e ações

### **Funcionalidades Integradas**
- ✅ **Login Bancário**: Interface completa de autenticação
- ✅ **Dashboard Bancário**: Saldo e informações da conta
- ✅ **Modal de Investimento**: Compra de ações com saldo real
- ✅ **Histórico de Transações**: Visualização de ordens executadas
- ✅ **Notificações**: Feedback em tempo real das operações

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **Python 3.8+**: Linguagem principal
- **Flask**: Framework web
- **SQLite**: Banco de dados
- **JWT**: Autenticação
- **bcrypt**: Criptografia de senhas
- **Requests**: Comunicação entre serviços

### **Frontend**
- **JavaScript ES6+**: Integração com APIs
- **Fetch API**: Requisições HTTP
- **LocalStorage**: Armazenamento de tokens
- **CSS3**: Estilos responsivos

## 📈 Métricas e Monitoramento

### **Health Checks**
Todos os serviços expõem endpoint `/health`:
```bash
curl http://localhost:5001/health
# Retorna: {"status": "healthy", "service": "userservice"}
```

### **Logs de Transações**
- Todas as operações são logadas
- Timestamps automáticos
- Rastreabilidade completa

## 🔄 Próximas Funcionalidades

### **Fase 2 - Recursos Avançados**
- [ ] **Notificações Push**: Alertas de transações
- [ ] **Análise de Risco**: Validação automática de operações
- [ ] **Limites de Investimento**: Controles de exposição
- [ ] **Relatórios**: Extratos e demonstrativos

### **Fase 3 - Escalabilidade**
- [ ] **Docker Compose**: Containerização completa
- [ ] **Kubernetes**: Deploy em cluster
- [ ] **PostgreSQL**: Banco de dados robusto
- [ ] **Redis**: Cache e sessões

## 🤝 Contribuição

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Implemente** seguindo os padrões do Bank of Anthos
4. **Teste** com as contas de demonstração
5. **Submeta** um Pull Request

## 📞 Suporte

- **Issues**: Reporte bugs ou solicite funcionalidades
- **Documentação**: Veja exemplos de uso nos arquivos de teste
- **Logs**: Verifique os logs dos serviços para debugging

---

**O sistema bancário está totalmente integrado ao AI Economic Advisor, proporcionando uma experiência completa de investimentos com autenticação real e transações simuladas!** 🎉