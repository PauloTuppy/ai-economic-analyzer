# 🪟 AI Economic Advisor - Guia para Windows

Guia específico para usuários Windows executarem o AI Economic Advisor com sistema bancário integrado.

## 🚀 **Início Rápido para Windows**

### **Opção 1: Setup Automático (Recomendado)**
```powershell
# 1. Clone o repositório
git clone https://github.com/PauloTuppy/ai-economic-analyzer.git
cd ai-economic-analyzer

# 2. Execute o setup automático
.\setup-windows.ps1

# 3. Inicie todos os serviços
.\start-all-windows.ps1
# OU simplesmente clique duas vezes em: start.bat
```

### **Opção 2: Docker (Mais Simples)**
```powershell
# 1. Certifique-se que o Docker Desktop está rodando
# 2. Execute o script Docker
.\docker-start-windows.ps1
```

### **Opção 3: Manual (Passo a Passo)**
```powershell
# Terminal 1 - Serviços Bancários
cd banking-services
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python start-services.py

# Terminal 2 - Backend
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py

# Terminal 3 - Frontend
cd frontend
node server.js
```

## 📋 **Pré-requisitos para Windows**

### **Instalações Necessárias**
1. **Python 3.9+**: [Download Python](https://python.org/downloads/)
   - ✅ Marque "Add Python to PATH" durante a instalação
   
2. **Node.js 16+**: [Download Node.js](https://nodejs.org/)
   - ✅ Inclui npm automaticamente
   
3. **Git**: [Download Git](https://git-scm.com/download/win)
   - ✅ Para clonar o repositório

### **Opcional (para Docker)**
4. **Docker Desktop**: [Download Docker](https://www.docker.com/products/docker-desktop/)
   - ✅ Inclui Docker Compose

## 🛠️ **Scripts PowerShell Disponíveis**

| Script | Função | Como Usar |
|--------|--------|-----------|
| `setup-windows.ps1` | Setup completo do ambiente | `.\setup-windows.ps1` |
| `start-all-windows.ps1` | Inicia todos os serviços | `.\start-all-windows.ps1` |
| `stop-all-windows.ps1` | Para todos os serviços | `.\stop-all-windows.ps1` |
| `docker-start-windows.ps1` | Deploy com Docker | `.\docker-start-windows.ps1` |

### **Arquivos .bat para Facilidade**
- `start.bat` - Clique duplo para iniciar
- `stop.bat` - Clique duplo para parar

## 🔧 **Solução de Problemas Windows**

### **Erro: "Execution Policy"**
```powershell
# Execute como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Erro: "Python não encontrado"**
```powershell
# Verifique se Python está no PATH
python --version
# Se não funcionar, reinstale Python marcando "Add to PATH"
```

### **Erro: "Node não encontrado"**
```powershell
# Verifique se Node.js está no PATH
node --version
npm --version
# Se não funcionar, reinstale Node.js
```

### **Erro: "Docker não está rodando"**
1. Abra Docker Desktop
2. Aguarde inicializar completamente
3. Execute novamente o script

### **Porta já em uso**
```powershell
# Encontre processo usando a porta
netstat -ano | findstr :3002
# Mate o processo (substitua PID)
taskkill /PID <PID> /F
```

## 🌐 **URLs de Acesso**

Após iniciar os serviços:

### **Frontend Principal**
- **Português**: http://localhost:3002/
- **English**: http://localhost:3002/index-en.html
- **Demo Mode**: http://localhost:3002/?demo=true

### **Sistema Bancário**
- **Login Bancário**: http://localhost:3002/banking-login.html
- **Modo Banking**: http://localhost:3002/?banking=true

### **APIs Backend**
- **Backend**: http://localhost:5000
- **User Service**: http://localhost:5001
- **Balance Service**: http://localhost:5002
- **Transaction Service**: http://localhost:5003

## 🏦 **Contas de Demonstração**

| Usuário | Senha | Saldo Inicial | Perfil |
|---------|-------|---------------|--------|
| `admin` | `admin123` | R$ 50.000,00 | Administrador |
| `investor` | `investor123` | R$ 25.000,00 | Investidor |
| `trader` | `trader123` | R$ 15.000,00 | Trader |

## 📊 **Como Testar no Windows**

### **1. Teste Básico**
1. Execute `.\start-all-windows.ps1`
2. Abra http://localhost:3002
3. Navegue pelas páginas (Dashboard, Portfolio, etc.)

### **2. Teste Banking**
1. Acesse http://localhost:3002/banking-login.html
2. Faça login com `investor` / `investor123`
3. Veja o saldo bancário no dashboard
4. Clique em "💰 Investir Agora"
5. Compre algumas ações
6. Verifique o histórico de transações

### **3. Teste AI**
1. Vá para a seção "AI Chat"
2. Faça uma pergunta sobre investimentos
3. Teste a otimização de portfolio

## 🔍 **Monitoramento no Windows**

### **Ver Logs**
```powershell
# Logs estão na pasta logs/
Get-Content logs\frontend.log -Tail 10
Get-Content logs\userservice.log -Tail 10
```

### **Verificar Processos**
```powershell
# Ver processos Python e Node
Get-Process python, node
```

### **Verificar Portas**
```powershell
# Ver quais portas estão em uso
netstat -an | findstr "3002 5000 5001 5002 5003"
```

## 🎯 **Dicas para Windows**

### **Performance**
- Use SSD se possível
- Feche outros programas pesados
- Configure antivírus para excluir a pasta do projeto

### **Desenvolvimento**
- Use Windows Terminal ou PowerShell ISE
- Configure VS Code com extensões Python e Node.js
- Use Git Bash para comandos Unix-like

### **Firewall**
- Windows pode pedir permissão para Python/Node
- ✅ Permita acesso às redes privadas

## 🆘 **Suporte Windows**

### **Logs de Erro**
Os logs ficam em:
- `logs\frontend.log`
- `logs\backend.log`
- `logs\userservice.log`
- `logs\balanceservice.log`
- `logs\transactionservice.log`

### **Comandos Úteis**
```powershell
# Limpar cache pip
pip cache purge

# Limpar cache npm
npm cache clean --force

# Recriar ambiente virtual
Remove-Item -Recurse -Force .venv
python -m venv .venv
```

### **Contato**
- **Issues**: [GitHub Issues](https://github.com/PauloTuppy/ai-economic-analyzer/issues)
- **Documentação**: README.md principal
- **Features**: frontend\FEATURES.md

---

**O AI Economic Advisor funciona perfeitamente no Windows com os scripts PowerShell otimizados!** 🪟🚀