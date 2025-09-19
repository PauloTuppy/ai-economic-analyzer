// AI Economic Advisor - Complete Version with Working Navigation
class EconomicAdvisor {
    constructor() {
        this.currentPage = 'dashboard';
        this.isInitialized = false;
        this.charts = {};
        this.chatHistory = [];
        this.realTimeInterval = null;
        this.bankingMode = new URLSearchParams(window.location.search).get('banking') === 'true';
        
        // Initialize AI services if available
        try {
            this.geminiAI = window.GeminiAIService ? new GeminiAIService('AIzaSyBbwCAk_HGqfEBkDVbpKlUgjvbO_a46nAw') : null;
            this.marketStrategy = window.MarketStrategyEngine ? new MarketStrategyEngine() : null;
            this.hullPredictor = window.HullMarketPredictor ? new HullMarketPredictor() : null;
        } catch (error) {
            console.warn('AI services not available:', error);
        }
        
        // Initialize Banking Service if in banking mode
        if (this.bankingMode) {
            try {
                this.bankingService = window.BankingService ? new BankingService() : null;
                this.checkBankingAuthentication();
            } catch (error) {
                console.warn('Banking service not available:', error);
            }
        }
        
        // Portfolio data with real-time simulation
        this.portfolioData = {
            total_value: 300727.30,
            total_return: 0.1887,
            holdings: [
                {symbol: "PETR4", quantity: 3600, purchase_price: 16.32, current_price: 19.80, value: 71280, return: 0.213},
                {symbol: "ITUB3", quantity: 1100, purchase_price: 43.87, current_price: 80.00, value: 88000, return: 0.823},
                {symbol: "BIDI4", quantity: 2164, purchase_price: 18.87, current_price: 18.40, value: 39817.6, return: -0.025},
                {symbol: "KNRI11", quantity: 180, purchase_price: 165.29, current_price: 163.50, value: 29430, return: -0.011},
                {symbol: "HGLG11", quantity: 220, purchase_price: 139.5, current_price: 133.20, value: 29304, return: -0.045},
                {symbol: "SNSL3", quantity: 1100, purchase_price: 26.97, current_price: 25.99, value: 28589, return: -0.036},
                {symbol: "BCFF11", quantity: 180, purchase_price: 84.38, current_price: 80.50, value: 14490, return: -0.046}
            ]
        };
        
        // Economic indicators
        this.economicData = {
            brazil_inflation: 4.2,
            selic_rate: 11.75,
            usd_brl: 5.12,
            oil_price: 82.50
        };
        
        // Risk metrics
        this.riskMetrics = {
            var_95: 2.3,
            max_drawdown: -8.9,
            sortino_ratio: 1.23,
            sharpe_ratio: 0.87,
            beta: 1.15
        };
        
        this.init();
    }

    checkBankingAuthentication() {
        if (this.bankingMode && this.bankingService && !this.bankingService.isAuthenticated()) {
            window.location.href = 'banking-login.html';
            return false;
        }
        return true;
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('🚀 Initializing AI Economic Advisor...');
        
        try {
            this.setupEventListeners();
            this.populateHoldingsTable();
            this.updateDashboardData();
            this.initializeCharts();
            this.setupThemeToggle();
            this.initializeChatInterface();
            this.startRealTimeUpdates();
            
            this.isInitialized = true;
            console.log('✅ AI Economic Advisor initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }

    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Navigation buttons - FIXED VERSION
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                console.log('🖱️ Navigation button clicked:', page);
                if (page) {
                    console.log('📍 Navigating to:', page);
                    this.navigateToPage(page);
                }
            });
        });

        // Portfolio control buttons
        this.setupPortfolioControls();
        
        // Chat functionality
        this.setupChatControls();
        
        // Refresh buttons
        document.querySelectorAll('.refresh-btn').forEach(btn => {
            btn.addEventListener('click', () => this.refreshData());
        });

        // Hull Tactical Analysis buttons
        this.setupHullControls();
        
        console.log('✅ Event listeners set up successfully');
    }

    setupHullControls() {
        const hullAnalyzeBtn = document.getElementById('hullAnalyzeBtn');
        const hullPredictBtn = document.getElementById('hullPredictBtn');

        if (hullAnalyzeBtn) {
            hullAnalyzeBtn.addEventListener('click', () => this.runHullAnalysis());
        }
        if (hullPredictBtn) {
            hullPredictBtn.addEventListener('click', () => this.generateHullPredictions());
        }

        // Auto-run Hull analysis on load
        setTimeout(() => {
            if (this.hullPredictor) {
                this.runHullAnalysis();
            }
        }, 3000);
    }

    setupPortfolioControls() {
        const optimizeBtn = document.getElementById('optimizeBtn');
        const rebalanceBtn = document.getElementById('rebalanceBtn');
        const exportBtn = document.getElementById('exportBtn');

        if (optimizeBtn) {
            optimizeBtn.addEventListener('click', () => this.optimizePortfolio());
        }
        if (rebalanceBtn) {
            rebalanceBtn.addEventListener('click', () => this.rebalancePortfolio());
        }
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReport());
        }
    }

    setupChatControls() {
        const sendBtn = document.getElementById('sendBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleChatMessage());
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleChatMessage();
                }
            });
        }

        // Quick question buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                if (question) {
                    this.handleQuickQuestion(question);
                }
            });
        });
    }

    navigateToPage(page) {
        if (!page) return;
        
        console.log('🔄 Navigating to page:', page);
        
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-page="${page}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
            console.log('✅ Active nav item updated');
        }

        // Show/hide pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });
        
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            this.currentPage = page;
            console.log('✅ Page switched to:', page);
            
            // Initialize page-specific content
            setTimeout(() => {
                this.initializePageContent(page);
            }, 100);
        } else {
            console.error('❌ Page not found:', page);
        }
    }

    initializePageContent(page) {
        switch (page) {
            case 'portfolio':
                this.populateHoldingsTable();
                break;
            case 'economic':
                this.updateEconomicIndicators();
                break;
            case 'risk':
                this.updateRiskMetrics();
                break;
            case 'chat':
                this.focusChatInput();
                break;
        }
    }

    async updateDashboardData() {
        // Update banking data if in banking mode
        if (this.bankingMode && this.bankingService && this.bankingService.isAuthenticated()) {
            await this.updateBankingData();
        }
        
        // Update portfolio value
        const portfolioValueEl = document.getElementById('portfolioValue');
        if (portfolioValueEl) {
            portfolioValueEl.textContent = this.formatCurrency(this.portfolioData.total_value);
        }

        // Update economic indicators
        this.updateEconomicIndicators();
        
        // Update AI insights
        this.updateAIInsights();
    }

    async updateBankingData() {
        try {
            const balance = await this.bankingService.getBalance();
            const portfolio = await this.bankingService.getPortfolio();
            
            this.displayBankingInfo(balance, portfolio);
        } catch (error) {
            console.error('Error updating banking data:', error);
        }
    }

    displayBankingInfo(balanceData, portfolioData) {
        // Add banking panel to dashboard
        const dashboardContent = document.querySelector('#dashboard .dashboard-grid');
        let bankingPanel = document.querySelector('.banking-panel');
        
        if (!bankingPanel && dashboardContent) {
            bankingPanel = document.createElement('div');
            bankingPanel.className = 'banking-panel';
            dashboardContent.insertBefore(bankingPanel, dashboardContent.firstChild);
        }

        const user = this.bankingService.currentUser;
        if (bankingPanel && user) {
            bankingPanel.innerHTML = `
                <div class="card banking-info">
                    <div class="card-header">
                        <h3>🏦 Informações Bancárias</h3>
                        <button class="btn btn--small" onclick="economicAdvisor.showTransactionHistory()">📊 Histórico</button>
                    </div>
                    <div class="card-body">
                        <div class="banking-details">
                            <div class="detail-item">
                                <span class="detail-label">Titular:</span>
                                <span class="detail-value">${user.full_name}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Conta:</span>
                                <span class="detail-value">${user.account_number}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Saldo Disponível:</span>
                                <span class="detail-value balance-amount">R$ ${balanceData.balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    updateEconomicIndicators() {
        const indicators = [
            { selector: '.indicator:nth-child(1) .indicator-value', value: this.economicData.brazil_inflation + '%' },
            { selector: '.indicator:nth-child(2) .indicator-value', value: this.economicData.selic_rate + '%' },
            { selector: '.indicator:nth-child(3) .indicator-value', value: this.economicData.usd_brl.toFixed(2) },
            { selector: '.indicator:nth-child(4) .indicator-value', value: '$' + this.economicData.oil_price.toFixed(2) }
        ];

        indicators.forEach(indicator => {
            const element = document.querySelector(indicator.selector);
            if (element) {
                element.textContent = indicator.value;
            }
        });
    }

    updateAIInsights() {
        const insights = [
            "Setor financeiro mostra forte momentum com ITUB3 liderando em +82,3%",
            "Exposição energética através de PETR4 oferece proteção efetiva contra inflação",
            "Considere diversificar além do mercado brasileiro para redução de risco"
        ];

        const insightElements = document.querySelectorAll('.insight-text');
        insights.forEach((insight, index) => {
            if (insightElements[index]) {
                insightElements[index].textContent = insight;
            }
        });
    }

    populateHoldingsTable() {
        const tableBody = document.querySelector('.holdings-table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        this.portfolioData.holdings.forEach(holding => {
            const row = document.createElement('tr');
            const returnClass = holding.return >= 0 ? 'positive' : 'negative';
            
            row.innerHTML = `
                <td>${holding.symbol}</td>
                <td>${holding.quantity}</td>
                <td>R$ ${holding.current_price.toFixed(2)}</td>
                <td>R$ ${holding.value.toLocaleString('pt-BR')}</td>
                <td class="${returnClass}">${(holding.return * 100).toFixed(1)}%</td>
            `;
            
            tableBody.appendChild(row);
        });
    }

    initializeCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, skipping chart initialization');
            return;
        }
        
        this.initializeDashboardCharts();
    }

    initializeDashboardCharts() {
        this.initializePortfolioChart();
        this.initializeMarketChart();
    }

    initializePortfolioChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.portfolioChart) {
            this.charts.portfolioChart.destroy();
        }

        this.charts.portfolioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Valor do Portfólio',
                    data: [275000, 280000, 285000, 290000, 295000, 300000, 305000, 310000, 315000, 320000, 315000, 300727],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => `R$ ${value.toLocaleString()}`
                        }
                    }
                }
            }
        });
    }

    initializeMarketChart() {
        const ctx = document.getElementById('marketChart');
        if (!ctx) return;

        if (this.charts.marketChart) {
            this.charts.marketChart.destroy();
        }

        this.charts.marketChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => `${i + 1}`),
                datasets: [
                    {
                        label: 'BOVESPA',
                        data: Array.from({length: 30}, () => Math.random() * 1000 + 120000),
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'S&P 500',
                        data: Array.from({length: 30}, () => Math.random() * 200 + 4200),
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
            });
        }
    }

    initializeChatInterface() {
        // Initialize chat with welcome message
        if (this.chatHistory.length === 0) {
            this.addChatMessage("Olá! Sou seu Consultor Econômico IA. Posso ajudar você a analisar seu portfólio, entender as condições de mercado e fornecer recomendações de investimento. O que gostaria de saber?", 'ai');
        }
    }

    async handleChatMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;

        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Generate AI response
            let response = "Desculpe, não consegui processar sua solicitação no momento.";
            
            if (this.geminiAI) {
                response = await this.geminiAI.generateResponse(message, this.getContextData());
            } else {
                // Fallback responses
                response = this.generateFallbackResponse(message);
            }

            // Remove typing indicator and add AI response
            this.hideTypingIndicator();
            this.addChatMessage(response, 'ai');

        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addChatMessage("Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.", 'ai');
        }
    }

    generateFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('portfólio') || lowerMessage.includes('portfolio')) {
            return `📊 **Análise do Portfólio:**\n\nSeu portfólio atual tem valor de R$ ${this.formatCurrency(this.portfolioData.total_value)} com retorno de +18,87%.\n\n**Destaques:**\n• ITUB3: +82,3% (melhor performance)\n• PETR4: +21,3% (boa proteção inflacionária)\n• Diversificação: 7 ativos diferentes\n\n**Sugestão:** Considere rebalancear posições com alta concentração.`;
        }
        
        if (lowerMessage.includes('mercado') || lowerMessage.includes('economia')) {
            return `📈 **Condições de Mercado:**\n\n• Inflação Brasil: 4,2% (+0,1%)\n• Taxa Selic: 11,75%\n• USD/BRL: 5,12\n• Petróleo: $82,50\n\n**Cenário:** Mercado brasileiro mostra resiliência com setor financeiro liderando ganhos.`;
        }
        
        if (lowerMessage.includes('risco')) {
            return `⚠️ **Análise de Risco:**\n\n• VaR (95%): 2,3%\n• Sharpe Ratio: 0,87\n• Beta: 1,15\n• Max Drawdown: -8,9%\n\n**Avaliação:** Risco moderado com boa relação risco-retorno.`;
        }
        
        return "Posso ajudar com análises de portfólio, condições de mercado, avaliação de risco e recomendações de investimento. Sobre o que gostaria de saber mais?";
    }

    handleQuickQuestion(question) {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = question;
            this.handleChatMessage();
        }
    }

    addChatMessage(message, sender) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = sender === 'ai' ? '🤖' : '👤';
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${message}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Store in history
        this.chatHistory.push({ message, sender, timestamp: new Date() });
    }

    showTypingIndicator() {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    focusChatInput() {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            setTimeout(() => chatInput.focus(), 100);
        }
    }

    getContextData() {
        return {
            portfolio: this.portfolioData,
            economic: this.economicData,
            risk: this.riskMetrics,
            bankingMode: this.bankingMode
        };
    }

    // Portfolio management functions
    async optimizePortfolio() {
        this.showLoading('Analisando portfólio com Hull Tactical Model + IA...');
        
        try {
            // Get Hull Market Prediction
            let hullAnalysis = null;
            if (this.hullPredictor) {
                hullAnalysis = await this.hullPredictor.generateMarketPrediction();
            }
            
            // Get individual stock predictions
            const stockPredictions = [];
            if (this.hullPredictor) {
                for (const holding of this.portfolioData.holdings) {
                    const prediction = await this.hullPredictor.getStockPrediction(holding.symbol);
                    stockPredictions.push(prediction);
                }
            }
            
            await this.delay(1500);
            
            // Generate recommendations based on Hull analysis
            const recommendations = this.generateHullBasedRecommendations(hullAnalysis, stockPredictions);
            
            this.hideLoading();
            this.navigateToPage('chat');
            
            setTimeout(() => {
                let message = `🎯 **Otimização Hull Tactical + IA Concluída**\n\n`;
                
                if (hullAnalysis) {
                    message += `**📊 Análise de Mercado Hull:**\n`;
                    message += `• Sinal: ${hullAnalysis.prediction.signal} (${(hullAnalysis.confidence.level * 100).toFixed(1)}% confiança)\n`;
                    message += `• Retorno Previsto: ${(hullAnalysis.prediction.forwardReturn * 100).toFixed(2)}%\n`;
                    message += `• Nível de Risco: ${hullAnalysis.riskLevel.overall}\n\n`;
                    
                    message += `**🎯 Recomendações Táticas:**\n`;
                    hullAnalysis.recommendations.forEach(rec => {
                        message += `• ${rec.action}: ${rec.allocation}\n`;
                        message += `  Razão: ${rec.reasoning}\n`;
                    });
                    message += `\n`;
                }
                
                message += `**📈 Recomendações por Ação:**\n`;
                recommendations.forEach(r => message += `• ${r}\n`);
                
                message += `\n**🔮 Modelo:** Hull Tactical Market Prediction\n**⚡ Novo Sharpe Ratio Estimado:** 1.2\n**🛡️ Redução de Risco:** 18%`;
                
                this.addChatMessage(message, 'ai');
            }, 500);
            
        } catch (error) {
            this.hideLoading();
            console.error('Portfolio optimization error:', error);
            
            // Fallback to basic recommendations
            const basicRecommendations = [
                "Reduzir ITUB3 de 29% para 20% - realizar lucros",
                "Aumentar exposição internacional em 10%",
                "Adicionar 5% em títulos do governo",
                "Manter PETR4 como hedge inflacionário"
            ];
            
            this.navigateToPage('chat');
            setTimeout(() => {
                const message = `🤖 **Otimização de Portfólio (Modo Básico)**\n\n**Recomendações:**\n${basicRecommendations.map(r => `• ${r}`).join('\n')}\n\n**Novo Sharpe Ratio Estimado:** 1.1\n**Redução de Risco:** 15%`;
                this.addChatMessage(message, 'ai');
            }, 500);
        }
    }

    generateHullBasedRecommendations(hullAnalysis, stockPredictions) {
        const recommendations = [];
        
        if (!hullAnalysis || !stockPredictions.length) {
            return [
                "Manter posições atuais - análise Hull indisponível",
                "Monitorar indicadores técnicos",
                "Revisar alocação em 1 semana"
            ];
        }
        
        // Generate recommendations based on Hull predictions
        stockPredictions.forEach(pred => {
            const holding = this.portfolioData.holdings.find(h => h.symbol === pred.symbol);
            if (holding) {
                const currentWeight = (holding.value / this.portfolioData.total_value * 100).toFixed(1);
                
                if (pred.recommendation === 'STRONG_BUY') {
                    recommendations.push(`${pred.symbol}: AUMENTAR de ${currentWeight}% para ${(parseFloat(currentWeight) + 5).toFixed(1)}% - Hull prevê retorno de ${(pred.predictedReturn * 100).toFixed(2)}%`);
                } else if (pred.recommendation === 'STRONG_SELL') {
                    recommendations.push(`${pred.symbol}: REDUZIR de ${currentWeight}% para ${Math.max(parseFloat(currentWeight) - 5, 2).toFixed(1)}% - Hull indica risco elevado`);
                } else if (pred.recommendation === 'BUY') {
                    recommendations.push(`${pred.symbol}: MANTER ou aumentar levemente (${currentWeight}%) - sinal positivo Hull`);
                } else if (pred.recommendation === 'SELL') {
                    recommendations.push(`${pred.symbol}: CONSIDERAR redução de ${currentWeight}% - sinal negativo Hull`);
                } else {
                    recommendations.push(`${pred.symbol}: MANTER posição atual (${currentWeight}%) - sinal neutro Hull`);
                }
            }
        });
        
        // Add tactical allocation based on market signal
        if (hullAnalysis.prediction.signal === 'BUY') {
            recommendations.push("TÁTICO: Aumentar exposição a ações para 70-75% do portfólio");
        } else if (hullAnalysis.prediction.signal === 'SELL') {
            recommendations.push("TÁTICO: Reduzir exposição a ações para 45-50%, aumentar caixa/renda fixa");
        }
        
        return recommendations;
    }

    rebalancePortfolio() {
        this.showLoading('Calculando rebalanceamento...');
        
        setTimeout(() => {
            this.hideLoading();
            this.navigateToPage('chat');
            setTimeout(() => {
                const message = "📊 **Rebalanceamento Sugerido:**\n\n• Vender 200 ações ITUB3\n• Comprar 500 ações PETR4\n• Adicionar R$ 15.000 em KNRI11\n\nIsso melhorará a diversificação do seu portfólio.";
                this.addChatMessage(message, 'ai');
            }, 500);
        }, 1500);
    }

    exportReport() {
        try {
            const reportData = {
                portfolio: this.portfolioData,
                economic: this.economicData,
                risk: this.riskMetrics,
                timestamp: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(reportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `portfolio-report-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.showNotification('✅ Relatório exportado com sucesso!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('❌ Erro ao exportar relatório', 'error');
        }
    }

    // Hull Tactical Analysis Methods
    async runHullAnalysis() {
        if (!this.hullPredictor) {
            this.updateHullStatus('Hull Predictor não disponível', 'error');
            return;
        }

        try {
            this.updateHullStatus('Analisando mercado...', 'loading');
            
            const analysis = await this.hullPredictor.generateMarketPrediction();
            
            // Update Hull status display
            const hullSignal = document.getElementById('hullSignal');
            const hullConfidence = document.getElementById('hullConfidence');
            const hullRecommendation = document.getElementById('hullRecommendation');
            
            if (hullSignal) {
                hullSignal.textContent = `${analysis.prediction.signal} (${(analysis.prediction.strength).toFixed(2)}x)`;
            }
            if (hullConfidence) {
                hullConfidence.textContent = `${(analysis.confidence.level * 100).toFixed(1)}% (${analysis.confidence.description})`;
            }
            if (hullRecommendation) {
                const mainRecommendation = analysis.recommendations[0];
                hullRecommendation.textContent = `${mainRecommendation.action} - ${mainRecommendation.timeHorizon}`;
            }
            
            // Update predictions area
            const predictionsDiv = document.getElementById('hullPredictions');
            if (predictionsDiv) {
                const mainRecommendation = analysis.recommendations[0];
                predictionsDiv.innerHTML = `
                    <div class="prediction-item">
                        <strong>📊 Análise de Mercado:</strong><br>
                        Retorno Previsto: ${(analysis.prediction.forwardReturn * 100).toFixed(2)}%<br>
                        Retorno Excesso: ${(analysis.prediction.excessReturn * 100).toFixed(2)}%<br>
                        Força do Sinal: ${analysis.prediction.strength.toFixed(2)}x
                    </div>
                    <div class="prediction-item">
                        <strong>🎯 Recomendação Tática:</strong><br>
                        ${mainRecommendation.reasoning}<br>
                        <span class="prediction-action action-${mainRecommendation.action.toLowerCase().replace('_', '-')}">${mainRecommendation.action}</span>
                    </div>
                    <div class="prediction-item">
                        <strong>⚠️ Gestão de Risco:</strong><br>
                        Nível Geral: ${analysis.riskLevel.overall}<br>
                        Volatilidade: ${analysis.riskLevel.volatility}<br>
                        Horizonte: ${mainRecommendation.timeHorizon}
                    </div>
                `;
            }
            
            console.log('🎯 Hull analysis completed:', analysis);
            
        } catch (error) {
            console.error('Hull analysis error:', error);
            this.updateHullStatus('Erro na análise Hull', 'error');
        }
    }

    async generateHullPredictions() {
        if (!this.hullPredictor) {
            this.updateHullStatus('Hull Predictor não disponível', 'error');
            return;
        }

        try {
            this.updateHullStatus('Gerando predições por ação...', 'loading');
            
            const predictions = [];
            for (const holding of this.portfolioData.holdings) {
                const prediction = await this.hullPredictor.getStockPrediction(holding.symbol);
                predictions.push(prediction);
            }
            
            // Update predictions display
            const predictionsDiv = document.getElementById('hullPredictions');
            if (predictionsDiv) {
                predictionsDiv.innerHTML = `
                    <div class="prediction-item">
                        <strong>📈 Predições por Ação (Hull Model):</strong>
                    </div>
                    ${predictions.map(pred => `
                        <div class="prediction-item">
                            <span class="prediction-symbol">${pred.symbol}</span>
                            <span class="prediction-action action-${pred.recommendation.toLowerCase().replace('_', '-')}">${pred.recommendation}</span><br>
                            <small>Retorno Previsto: ${(pred.predictedReturn * 100).toFixed(2)}% | Confiança: ${(pred.confidence.level * 100).toFixed(1)}%</small>
                        </div>
                    `).join('')}
                `;
            }
            
            // Also send to chat
            this.navigateToPage('chat');
            setTimeout(() => {
                let message = `🎯 **Predições Hull Tactical por Ação:**\n\n`;
                predictions.forEach(pred => {
                    message += `**${pred.symbol}**: ${pred.recommendation}\n`;
                    message += `• Retorno Previsto: ${(pred.predictedReturn * 100).toFixed(2)}%\n`;
                    message += `• Confiança: ${(pred.confidence.level * 100).toFixed(1)}%\n`;
                    message += `• Horizonte: ${pred.timeHorizon}\n\n`;
                });
                message += `*Baseado no Hull Tactical Market Model*`;
                this.addChatMessage(message, 'ai');
            }, 500);
            
        } catch (error) {
            console.error('Hull predictions error:', error);
            this.updateHullStatus('Erro nas predições Hull', 'error');
        }
    }

    updateHullStatus(message, type = 'info') {
        const statusElements = document.querySelectorAll('#hullSignal, #hullConfidence, #hullRecommendation');
        
        if (type === 'loading') {
            statusElements.forEach(el => {
                if (el) {
                    el.textContent = 'Carregando...';
                    el.style.color = 'var(--color-primary)';
                }
            });
        } else if (type === 'error') {
            statusElements.forEach(el => {
                if (el) {
                    el.textContent = 'Erro';
                    el.style.color = 'var(--color-error)';
                }
            });
            
            const predictionsDiv = document.getElementById('hullPredictions');
            if (predictionsDiv) {
                predictionsDiv.innerHTML = `<div class="prediction-placeholder" style="color: var(--color-error);">${message}</div>`;
            }
        }
    }

    // Utility functions
    startRealTimeUpdates() {
        // Update market data every 30 seconds
        this.realTimeInterval = setInterval(() => {
            this.updateMarketData();
        }, 30000);
    }

    updateMarketData() {
        // Simulate real-time price updates
        this.portfolioData.holdings.forEach(holding => {
            const change = (Math.random() - 0.5) * 0.02; // ±1% change
            holding.current_price *= (1 + change);
            holding.value = holding.quantity * holding.current_price;
            holding.return = (holding.current_price - holding.purchase_price) / holding.purchase_price;
        });

        // Update total portfolio value
        this.portfolioData.total_value = this.portfolioData.holdings.reduce((sum, holding) => sum + holding.value, 0);
        
        // Update display if on portfolio page
        if (this.currentPage === 'portfolio') {
            this.populateHoldingsTable();
        }
    }

    updateRiskMetrics() {
        // Update risk metrics display
        const riskElements = {
            '.risk-metric:nth-child(1) .metric-value': this.riskMetrics.var_95 + '%',
            '.risk-metric:nth-child(2) .metric-value': this.riskMetrics.max_drawdown + '%',
            '.risk-metric:nth-child(3) .metric-value': this.riskMetrics.sortino_ratio.toFixed(2)
        };

        Object.entries(riskElements).forEach(([selector, value]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = value;
            }
        });
    }

    refreshData() {
        this.updateDashboardData();
        this.updateMarketData();
        this.showNotification('✅ Dados atualizados!', 'success');
    }

    showLoading(message = 'Carregando...') {
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    formatCurrency(amount) {
        return amount.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.economicAdvisor = new EconomicAdvisor();
        console.log('🎉 AI Economic Advisor loaded successfully');
    } catch (error) {
        console.error('💥 Failed to initialize AI Economic Advisor:', error);
    }
});

// Handle errors gracefully
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
});