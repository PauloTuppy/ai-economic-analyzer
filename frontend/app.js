// AI Economic Advisor Application - Enhanced Version
class EconomicAdvisor {
    constructor() {
        this.currentPage = 'dashboard';
        this.isInitialized = false;
        this.charts = {};
        this.chatHistory = [];
        this.realTimeInterval = null;
        
        // Initialize AI services if available
        try {
            this.geminiAI = window.GeminiAIService ? new GeminiAIService('AIzaSyBbwCAk_HGqfEBkDVbpKlUgjvbO_a46nAw') : null;
            this.marketStrategy = window.MarketStrategyEngine ? new MarketStrategyEngine() : null;
        } catch (error) {
            console.warn('AI services not available:', error);
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
            this.setupRiskSlider();
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
        
        // Navigation buttons
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
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
        
        console.log('✅ Event listeners set up successfully');
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
            
            // Initialize page-specific content
            setTimeout(() => {
                this.initializePageContent(page);
            }, 100);
        }
    }

    initializePageContent(page) {
        switch (page) {
            case 'dashboard':
                this.updateDashboardData();
                this.initializeDashboardCharts();
                break;
            case 'portfolio':
                this.populateHoldingsTable();
                this.initializeAllocationChart();
                break;
            case 'economic':
                this.initializeEconomicChart();
                break;
            case 'risk':
                this.initializeRiskCharts();
                break;
            case 'chat':
                this.focusChatInput();
                break;
        }
    }

    updateDashboardData() {
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
            "Setor financeiro mostra forte momentum com ITUB3 liderando em +82.3%",
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
        const tableBody = document.getElementById('holdingsTable');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        this.portfolioData.holdings.forEach(holding => {
            const row = document.createElement('div');
            row.className = 'table-row';
            
            const returnClass = holding.return >= 0 ? 'positive' : 'negative';
            const returnPercent = (holding.return * 100).toFixed(1);
            
            row.innerHTML = `
                <div class="symbol">${holding.symbol}</div>
                <div>${holding.quantity.toLocaleString()}</div>
                <div>R$ ${holding.current_price.toFixed(2)}</div>
                <div>R$ ${holding.value.toLocaleString()}</div>
                <div class="return-cell ${returnClass}">${returnPercent}%</div>
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
        if (!ctx || typeof Chart === 'undefined') return;

        const data = this.generatePortfolioData();
        
        if (this.charts.portfolioChart) {
            this.charts.portfolioChart.destroy();
        }

        this.charts.portfolioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Portfolio Value (R$)',
                    data: data.values,
                    borderColor: '#32B8CD',
                    backgroundColor: 'rgba(50, 184, 205, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
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
        if (!ctx || typeof Chart === 'undefined') return;

        const data = this.generateMarketData();
        
        if (this.charts.marketChart) {
            this.charts.marketChart.destroy();
        }

        this.charts.marketChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'IBOVESPA',
                        data: data.ibovespa,
                        borderColor: '#32B8CD',
                        backgroundColor: 'rgba(50, 184, 205, 0.1)',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'S&P 500',
                        data: data.sp500,
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' }
                },
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });
    }

    initializeAllocationChart() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx || typeof Chart === 'undefined') return;

        const allocations = this.calculatePortfolioAllocations();
        
        if (this.charts.allocationChart) {
            this.charts.allocationChart.destroy();
        }

        this.charts.allocationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: allocations.labels,
                datasets: [{
                    data: allocations.values,
                    backgroundColor: [
                        '#32B8CD', '#F59E0B', '#EF4444', '#10B981', 
                        '#8B5CF6', '#F97316', '#EC4899'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    }

    initializeEconomicChart() {
        const ctx = document.getElementById('economicChart');
        if (!ctx || typeof Chart === 'undefined') return;

        const data = this.generateEconomicData();
        
        if (this.charts.economicChart) {
            this.charts.economicChart.destroy();
        }

        this.charts.economicChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Brazil Inflation (%)',
                        data: data.inflation,
                        borderColor: '#32B8CD',
                        backgroundColor: 'rgba(50, 184, 205, 0.1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Selic Rate (%)',
                        data: data.selic,
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });
    }

    initializeRiskCharts() {
        const ctx = document.getElementById('correlationChart');
        if (!ctx || typeof Chart === 'undefined') return;

        const assets = ['PETR4', 'ITUB3', 'BIDI4', 'KNRI11', 'HGLG11'];
        const correlations = [0.8, -0.3, 0.6, 0.4, 0.2];
        
        if (this.charts.correlationChart) {
            this.charts.correlationChart.destroy();
        }

        this.charts.correlationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: assets,
                datasets: [{
                    label: 'Correlation with PETR4',
                    data: correlations,
                    backgroundColor: ['#32B8CD', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: -1,
                        max: 1,
                        title: { display: true, text: 'Correlation Coefficient' }
                    }
                }
            }
        });
    }

    // Data generation methods
    generatePortfolioData() {
        const labels = [];
        const values = [];
        const baseValue = this.portfolioData.total_value;
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }));
            
            const variation = Math.sin(i * 0.2) * 15000 + (Math.random() - 0.5) * 8000;
            values.push(Math.max(250000, baseValue + variation + (30 - i) * 1000));
        }
        
        return { labels, values };
    }

    generateMarketData() {
        const labels = [];
        const ibovespa = [];
        const sp500 = [];
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }));
            
            ibovespa.push(120000 + Math.sin(i * 0.3) * 8000 + (Math.random() - 0.5) * 3000);
            sp500.push(4200 + Math.sin(i * 0.25) * 200 + (Math.random() - 0.5) * 100);
        }
        
        return { labels, ibovespa, sp500 };
    }

    generateEconomicData() {
        const labels = [];
        const inflation = [];
        const selic = [];
        
        for (let i = 12; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            labels.push(date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }));
            
            inflation.push(3.5 + Math.sin(i * 0.5) * 1.2 + (Math.random() - 0.5) * 0.3);
            selic.push(11.5 + Math.sin(i * 0.4) * 0.8 + (Math.random() - 0.5) * 0.2);
        }
        
        return { labels, inflation, selic };
    }

    calculatePortfolioAllocations() {
        const labels = [];
        const values = [];
        
        this.portfolioData.holdings.forEach(holding => {
            labels.push(holding.symbol);
            values.push(((holding.value / this.portfolioData.total_value) * 100).toFixed(1));
        });
        
        return { labels, values };
    }

    // Portfolio management functions
    async optimizePortfolio() {
        this.showLoading('Analisando portfólio com IA...');
        
        try {
            // Simulate AI analysis
            await this.delay(2000);
            
            const recommendations = [
                "Reduzir ITUB3 de 29% para 20% - realizar lucros",
                "Aumentar exposição internacional em 10%",
                "Adicionar 5% em títulos do governo",
                "Manter PETR4 como hedge inflacionário"
            ];
            
            this.hideLoading();
            this.navigateToPage('chat');
            
            setTimeout(() => {
                const message = `🤖 **Otimização de Portfólio Concluída**\n\n**Recomendações:**\n${recommendations.map(r => `• ${r}`).join('\n')}\n\n**Novo Sharpe Ratio Estimado:** 1.1\n**Redução de Risco:** 15%`;
                this.addChatMessage(message, 'ai');
            }, 500);
            
        } catch (error) {
            this.hideLoading();
            console.error('Portfolio optimization error:', error);
        }
    }

    rebalancePortfolio() {
        this.showLoading('Calculando rebalanceamento...');
        
        setTimeout(() => {
            this.hideLoading();
            alert('✅ Simulação de rebalanceamento concluída!\n\nRecomendações enviadas para o chat.');
            
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
                risk_metrics: this.riskMetrics,
                economic_data: this.economicData,
                generated_at: new Date().toISOString(),
                recommendations: [
                    "Manter diversificação atual",
                    "Monitorar exposição ao dólar",
                    "Considerar hedge inflacionário"
                ]
            };
            
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `portfolio_report_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            
            console.log('✅ Report exported successfully');
        } catch (error) {
            console.error('❌ Error exporting report:', error);
            alert('Erro ao exportar relatório. Tente novamente.');
        }
    }

    // Chat functionality
    initializeChatInterface() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer && messagesContainer.children.length <= 1) {
            console.log('💬 Chat interface initialized');
        }
    }

    async handleChatMessage() {
        const input = document.getElementById('chatInput');
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        this.addChatMessage(message, 'user');
        input.value = '';
        
        this.showTypingIndicator();
        
        try {
            let response;
            if (this.geminiAI) {
                const context = {
                    portfolioValue: this.formatCurrency(this.portfolioData.total_value),
                    portfolioReturn: (this.portfolioData.total_return * 100).toFixed(2) + '%'
                };
                response = await this.geminiAI.generateContent(message, context);
            } else {
                response = this.generateAIResponse(message);
            }
            
            this.hideTypingIndicator();
            this.addChatMessage(response, 'ai');
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addChatMessage('Desculpe, ocorreu um erro. Tente novamente.', 'ai');
        }
    }

    handleQuickQuestion(question) {
        this.addChatMessage(question, 'user');
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(question);
            this.addChatMessage(response, 'ai');
        }, 1500);
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'ai' ? '🤖' : '👤';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">${avatar}</div>
                <div class="message-text">${message}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.chatHistory.push({message, sender, timestamp: new Date()});
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">🤖</div>
                <div class="message-text">IA está pensando...</div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        const responses = {
            'brasil': 'O mercado brasileiro apresenta oportunidades com Selic em 11,75%. Recomendo manter exposição em bancos e energia, mas diversificar internacionalmente.',
            'inflação': 'Com inflação em 4,2%, PETR4 e REITs oferecem proteção. Considere títulos indexados ao IPCA.',
            'risco': 'Seu VaR de 2,3% e Sharpe de 0,87 são sólidos. Considere reduzir concentração brasileira.',
            'otimizar': 'Recomendo: 1) Reduzir ITUB3 para 20%, 2) Adicionar exposição internacional, 3) Aumentar cash para oportunidades.'
        };
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return 'Baseado no seu portfólio (+18,87%), você está bem posicionado. ITUB3 lidera com +82,3%. Posso ajudar com análises específicas?';
    }

    // Real-time updates
    startRealTimeUpdates() {
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }
        
        this.realTimeInterval = setInterval(() => {
            this.updateRealTimeData();
        }, 30000); // Update every 30 seconds
        
        console.log('📊 Real-time updates started');
    }

    updateRealTimeData() {
        if (!this.isInitialized) return;
        
        // Simulate small price changes
        this.portfolioData.holdings.forEach(holding => {
            const change = (Math.random() - 0.5) * 0.02; // ±1% max change
            holding.current_price *= (1 + change);
            holding.value = holding.quantity * holding.current_price;
            holding.return = (holding.current_price - holding.purchase_price) / holding.purchase_price;
        });
        
        // Update total portfolio value
        this.portfolioData.total_value = this.portfolioData.holdings.reduce((sum, h) => sum + h.value, 0);
        
        // Update UI if on relevant pages
        if (this.currentPage === 'dashboard') {
            this.updateDashboardData();
        } else if (this.currentPage === 'portfolio') {
            this.populateHoldingsTable();
        }
        
        // Update charts
        this.updateCharts();
    }

    updateCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.update) {
                chart.update('none'); // Update without animation
            }
        });
    }

    refreshData() {
        console.log('🔄 Refreshing data...');
        this.updateRealTimeData();
        
        // Visual feedback
        document.querySelectorAll('.refresh-btn').forEach(btn => {
            btn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                btn.style.transform = 'rotate(0deg)';
            }, 500);
        });
    }

    // Theme toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            
            // Update charts for theme change
            setTimeout(() => this.updateCharts(), 100);
        });
    }

    // Risk slider
    setupRiskSlider() {
        const riskSlider = document.getElementById('riskLevel');
        const riskValue = document.getElementById('riskLevelValue');
        
        if (riskSlider && riskValue) {
            const riskLabels = ['Conservador', 'Cauteloso', 'Moderado', 'Agressivo', 'Muito Agressivo'];
            
            riskSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                riskValue.textContent = riskLabels[value - 1];
            });
        }
    }

    focusChatInput() {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            setTimeout(() => chatInput.focus(), 200);
        }
    }

    // Utility functions
    showLoading(message = 'Processando...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = document.querySelector('.loading-text');
        
        if (overlay && text) {
            text.textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EconomicAdvisor;
}