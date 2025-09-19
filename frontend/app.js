// AI Economic Advisor Application - Enhanced Version
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
                { symbol: "PETR4", quantity: 3600, purchase_price: 16.32, current_price: 19.80, value: 71280, return: 0.213 },
                { symbol: "ITUB3", quantity: 1100, purchase_price: 43.87, current_price: 80.00, value: 88000, return: 0.823 },
                { symbol: "BIDI4", quantity: 2164, purchase_price: 18.87, current_price: 18.40, value: 39817.6, return: -0.025 },
                { symbol: "KNRI11", quantity: 180, purchase_price: 165.29, current_price: 163.50, value: 29430, return: -0.011 },
                { symbol: "HGLG11", quantity: 220, purchase_price: 139.5, current_price: 133.20, value: 29304, return: -0.045 },
                { symbol: "SNSL3", quantity: 1100, purchase_price: 26.97, current_price: 25.99, value: 28589, return: -0.036 },
                { symbol: "BCFF11", quantity: 180, purchase_price: 84.38, current_price: 80.50, value: 14490, return: -0.046 }
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
            // Redirect to banking login if not authenticated
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

    async updateDashboardData() {
        // Update banking information if in banking mode
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
            // Get current balance
            const balanceData = await this.bankingService.getBalance();

            // Get portfolio from banking service
            const portfolioData = await this.bankingService.getPortfolio();

            // Update UI with banking data
            this.displayBankingInfo(balanceData, portfolioData);

        } catch (error) {
            console.error('Error updating banking data:', error);
        }
    }

    displayBankingInfo(balanceData, portfolioData) {
        // Add banking info to dashboard
        const dashboardContent = document.querySelector('.dashboard-content');
        if (!dashboardContent) return;

        // Check if banking panel already exists
        let bankingPanel = document.getElementById('banking-panel');
        if (!bankingPanel) {
            bankingPanel = document.createElement('div');
            bankingPanel.id = 'banking-panel';
            bankingPanel.className = 'banking-panel';
            dashboardContent.insertBefore(bankingPanel, dashboardContent.firstChild);
        }

        const user = this.bankingService.currentUser;

        bankingPanel.innerHTML = `
            <div class="banking-header">
                <h3>🏦 Conta Bancária</h3>
                <div class="user-info">
                    <span class="user-name">${user.full_name}</span>
                    <span class="account-number">Conta: ${user.account_number}</span>
                </div>
            </div>
            <div class="banking-balance">
                <div class="balance-item">
                    <span class="balance-label">Saldo Disponível:</span>
                    <span class="balance-value">${this.bankingService.formatCurrency(balanceData.available_balance)}</span>
                </div>
                <div class="balance-item">
                    <span class="balance-label">Saldo Total:</span>
                    <span class="balance-value">${this.bankingService.formatCurrency(balanceData.balance)}</span>
                </div>
            </div>
            <div class="banking-actions">
                <button class="btn-primary" onclick="window.economicAdvisor.showInvestmentModal()">
                    💰 Investir Agora
                </button>
                <button class="btn-secondary" onclick="window.economicAdvisor.showTransactionHistory()">
                    📊 Histórico
                </button>
                <button class="btn-secondary" onclick="window.economicAdvisor.logout()">
                    🚪 Sair
                </button>
            </div>
        `;
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

        this.chatHistory.push({ message, sender, timestamp: new Date() });
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

    // Banking Methods
    showInvestmentModal() {
        const modal = document.createElement('div');
        modal.className = 'investment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>💰 Investir em Ações</h3>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Ação:</label>
                        <select id="investment-symbol">
                            <option value="PETR4">PETR4 - Petrobras</option>
                            <option value="ITUB3">ITUB3 - Itaú</option>
                            <option value="BIDI4">BIDI4 - Banco Inter</option>
                            <option value="KNRI11">KNRI11 - Kinea</option>
                            <option value="HGLG11">HGLG11 - HGLG</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Quantidade:</label>
                        <input type="number" id="investment-quantity" min="1" value="100">
                    </div>
                    <div class="form-group">
                        <label>Preço por Ação:</label>
                        <input type="number" id="investment-price" step="0.01" value="20.00">
                    </div>
                    <div class="investment-total">
                        <strong>Total: <span id="investment-total">R$ 2.000,00</span></strong>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="window.economicAdvisor.executeInvestment()">
                        Comprar Ações
                    </button>
                    <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Cancelar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Update total when values change
        const quantityInput = document.getElementById('investment-quantity');
        const priceInput = document.getElementById('investment-price');
        const totalSpan = document.getElementById('investment-total');

        const updateTotal = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const total = quantity * price;
            totalSpan.textContent = this.formatCurrency(total);
        };

        quantityInput.addEventListener('input', updateTotal);
        priceInput.addEventListener('input', updateTotal);
    }

    async executeInvestment() {
        const symbol = document.getElementById('investment-symbol').value;
        const quantity = parseInt(document.getElementById('investment-quantity').value);
        const price = parseFloat(document.getElementById('investment-price').value);

        if (!symbol || quantity <= 0 || price <= 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        try {
            const result = await this.bankingService.buyAsset(symbol, quantity, price);

            // Show success message
            this.showNotification(`✅ ${result.message}`, 'success');

            // Close modal
            document.querySelector('.investment-modal').remove();

            // Refresh data
            await this.updateDashboardData();
            this.populateHoldingsTable();

        } catch (error) {
            this.showNotification(`❌ Erro na compra: ${error.message}`, 'error');
        }
    }

    async showTransactionHistory() {
        try {
            const history = await this.bankingService.getTransactionHistory();

            const modal = document.createElement('div');
            modal.className = 'transaction-modal';
            modal.innerHTML = `
                <div class="modal-content large">
                    <div class="modal-header">
                        <h3>📊 Histórico de Transações</h3>
                        <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="transaction-list">
                            ${history.orders.map(order => `
                                <div class="transaction-item">
                                    <div class="transaction-info">
                                        <span class="transaction-symbol">${order.symbol}</span>
                                        <span class="transaction-type ${order.order_type}">${order.order_type.toUpperCase()}</span>
                                        <span class="transaction-quantity">${order.quantity} ações</span>
                                    </div>
                                    <div class="transaction-details">
                                        <span class="transaction-amount">${this.formatCurrency(order.total_amount)}</span>
                                        <span class="transaction-date">${new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                                        <span class="transaction-status ${order.status}">${order.status}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

        } catch (error) {
            this.showNotification(`❌ Erro ao carregar histórico: ${error.message}`, 'error');
        }
    }

    logout() {
        if (this.bankingService) {
            this.bankingService.logout();
        }
        window.location.href = 'banking-login.html';
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
            document.getElementById('hullSignal').textContent =
                `${analysis.prediction.signal} (${(analysis.prediction.strength).toFixed(2)}x)`;
            document.getElementById('hullConfidence').textContent =
                `${(analysis.confidence.level * 100).toFixed(1)}% (${analysis.confidence.description})`;

            const mainRecommendation = analysis.recommendations[0];
            document.getElementById('hullRecommendation').textContent =
                `${mainRecommendation.action} - ${mainRecommendation.timeHorizon}`;

            // Update predictions area
            const predictionsDiv = document.getElementById('hullPredictions');
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
                el.textContent = 'Carregando...';
                el.style.color = 'var(--color-primary)';
            });
        } else if (type === 'error') {
            statusElements.forEach(el => {
                el.textContent = 'Erro';
                el.style.color = 'var(--color-error)';
            });

            const predictionsDiv = document.getElementById('hullPredictions');
            if (predictionsDiv) {
                predictionsDiv.innerHTML = `<div class="prediction-placeholder" style="color: var(--color-error);">${message}</div>`;
            }
        }
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

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EconomicAdvisor;
}