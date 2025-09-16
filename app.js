// AI Economic Advisor Application
class EconomicAdvisor {
    constructor() {
        this.currentPage = 'dashboard';
        this.portfolioData = {
            total_value: 300910.6,
            total_return: 0.1887,
            holdings: [
                {symbol: "PETR4", quantity: 3600, purchase_price: 16.32, current_price: 19.8, value: 71280, return: 0.213},
                {symbol: "ITUB3", quantity: 1100, purchase_price: 43.87, current_price: 80, value: 88000, return: 0.823},
                {symbol: "BIDI4", quantity: 2164, purchase_price: 18.87, current_price: 18.4, value: 39817.6, return: -0.025},
                {symbol: "KNRI11", quantity: 180, purchase_price: 165.29, current_price: 163.5, value: 29430, return: -0.011},
                {symbol: "HGLG11", quantity: 220, purchase_price: 139.5, current_price: 133.2, value: 29304, return: -0.045},
                {symbol: "SNSL3", quantity: 1100, purchase_price: 26.97, current_price: 25.99, value: 28589, return: -0.036},
                {symbol: "BCFF11", quantity: 180, purchase_price: 84.38, current_price: 80.5, value: 14490, return: -0.046}
            ]
        };
        this.economicData = {
            brazil: {inflation_rate: 4.2, interest_rate: 11.75, gdp_growth: 2.8, unemployment: 7.9},
            global: {us_inflation: 3.1, us_fed_rate: 5.25, eur_inflation: 2.4, oil_price: 82.5, gold_price: 1950}
        };
        this.riskMetrics = {
            portfolio_var_95: 0.023,
            portfolio_beta: 1.15,
            sharpe_ratio: 0.87,
            sortino_ratio: 1.23,
            max_drawdown: -0.089
        };
        this.charts = {};
        this.chatHistory = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('Initializing AI Economic Advisor...');
        this.setupEventListeners();
        this.populateHoldingsTable();
        this.initializeCharts();
        this.setupThemeToggle();
        this.setupRiskSlider();
        this.initializeChatInterface();
        this.isInitialized = true;
        
        // Start real-time updates with more conservative frequency
        setTimeout(() => {
            this.simulateRealTimeUpdates();
        }, 5000);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation - Fix the navigation system
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = e.target.dataset.page;
                console.log('Navigation clicked:', page);
                this.navigateToPage(page);
            });
        });

        // Chat functionality
        const sendBtn = document.getElementById('sendBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleChatMessage();
            });
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleChatMessage();
                }
            });
        }

        // Quick questions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const question = e.target.dataset.question;
                if (question) {
                    this.handleQuickQuestion(question);
                }
            });
        });

        // Portfolio controls
        const optimizeBtn = document.getElementById('optimizeBtn');
        const rebalanceBtn = document.getElementById('rebalanceBtn');
        const exportBtn = document.getElementById('exportBtn');

        if (optimizeBtn) {
            optimizeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.optimizePortfolio();
            });
        }
        if (rebalanceBtn) {
            rebalanceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.rebalancePortfolio();
            });
        }
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportReport();
            });
        }

        // Refresh economic data
        document.querySelectorAll('.refresh-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.refreshEconomicData();
            });
        });

        console.log('Event listeners set up successfully');
    }

    navigateToPage(page) {
        if (!page) {
            console.error('No page specified for navigation');
            return;
        }

        console.log('Navigating to page:', page);

        // Update active nav item
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
        });
        
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Initialize page-specific functionality
            setTimeout(() => {
                this.initializePageCharts(page);
            }, 100);
        } else {
            console.error('Page not found:', page);
        }
    }

    initializePageCharts(page) {
        switch (page) {
            case 'portfolio':
                if (!this.charts.allocationChart) {
                    this.initializeAllocationChart();
                }
                break;
            case 'economic':
                if (!this.charts.economicChart) {
                    this.initializeEconomicChart();
                }
                break;
            case 'risk':
                if (!this.charts.correlationChart) {
                    this.initializeCorrelationChart();
                }
                break;
        }
    }

    initializeCharts() {
        console.log('Initializing charts...');
        
        // Only initialize charts that are currently visible
        if (this.currentPage === 'dashboard') {
            this.initializePortfolioChart();
            this.initializeMarketChart();
        }
    }

    initializePortfolioChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) {
            console.warn('Portfolio chart canvas not found');
            return;
        }

        try {
            const data = this.generatePortfolioPerformanceData();
            
            this.charts.portfolioChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Portfolio Value (R$)',
                        data: data.values,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
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
            console.log('Portfolio chart initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio chart:', error);
        }
    }

    initializeMarketChart() {
        const ctx = document.getElementById('marketChart');
        if (!ctx) {
            console.warn('Market chart canvas not found');
            return;
        }

        try {
            const data = this.generateMarketData();
            
            this.charts.marketChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'IBOVESPA',
                            data: data.ibovespa,
                            borderColor: '#1FB8CD',
                            backgroundColor: 'rgba(31, 184, 205, 0.1)',
                            borderWidth: 2,
                            fill: false
                        },
                        {
                            label: 'S&P 500',
                            data: data.sp500,
                            borderColor: '#FFC185',
                            backgroundColor: 'rgba(255, 193, 133, 0.1)',
                            borderWidth: 2,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
            console.log('Market chart initialized successfully');
        } catch (error) {
            console.error('Error initializing market chart:', error);
        }
    }

    initializeAllocationChart() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) {
            console.warn('Allocation chart canvas not found');
            return;
        }

        try {
            const allocations = this.calculatePortfolioAllocations();
            
            this.charts.allocationChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: allocations.labels,
                    datasets: [{
                        data: allocations.values,
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
            console.log('Allocation chart initialized successfully');
        } catch (error) {
            console.error('Error initializing allocation chart:', error);
        }
    }

    initializeEconomicChart() {
        const ctx = document.getElementById('economicChart');
        if (!ctx) {
            console.warn('Economic chart canvas not found');
            return;
        }

        try {
            const data = this.generateEconomicTrendData();
            
            this.charts.economicChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Brazil Inflation (%)',
                            data: data.inflation,
                            borderColor: '#1FB8CD',
                            backgroundColor: 'rgba(31, 184, 205, 0.1)',
                            borderWidth: 2,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Selic Rate (%)',
                            data: data.selic,
                            borderColor: '#FFC185',
                            backgroundColor: 'rgba(255, 193, 133, 0.1)',
                            borderWidth: 2,
                            yAxisID: 'y'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                        }
                    }
                }
            });
            console.log('Economic chart initialized successfully');
        } catch (error) {
            console.error('Error initializing economic chart:', error);
        }
    }

    initializeCorrelationChart() {
        const ctx = document.getElementById('correlationChart');
        if (!ctx) {
            console.warn('Correlation chart canvas not found');
            return;
        }

        try {
            // Create correlation matrix visualization as a bar chart for better readability
            const assets = ['PETR4', 'ITUB3', 'BIDI4', 'KNRI11', 'HGLG11'];
            const correlations = [0.8, -0.3, 0.6, 0.4, 0.2]; // Sample correlations with PETR4
            
            this.charts.correlationChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: assets,
                    datasets: [{
                        label: 'Correlation with PETR4',
                        data: correlations,
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            min: -1,
                            max: 1,
                            title: {
                                display: true,
                                text: 'Correlation Coefficient'
                            }
                        }
                    }
                }
            });
            console.log('Correlation chart initialized successfully');
        } catch (error) {
            console.error('Error initializing correlation chart:', error);
        }
    }

    populateHoldingsTable() {
        const tableBody = document.getElementById('holdingsTable');
        if (!tableBody) {
            console.warn('Holdings table not found');
            return;
        }

        try {
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
            console.log('Holdings table populated successfully');
        } catch (error) {
            console.error('Error populating holdings table:', error);
        }
    }

    initializeChatInterface() {
        console.log('Initializing chat interface...');
        
        // Add initial AI message if chat messages container is empty
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer && messagesContainer.children.length <= 1) {
            // Initial message is already in HTML, don't duplicate
            console.log('Chat interface initialized with welcome message');
        }
    }

    handleChatMessage() {
        const input = document.getElementById('chatInput');
        if (!input || !input.value.trim()) {
            console.warn('No message to send');
            return;
        }

        const message = input.value.trim();
        console.log('Handling chat message:', message);
        
        this.addChatMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI response delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(message);
            this.addChatMessage(response, 'ai');
        }, 1500);
    }

    handleQuickQuestion(question) {
        console.log('Handling quick question:', question);
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
        if (!messagesContainer) {
            console.warn('Chat messages container not found');
            return;
        }

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
        console.log('Chat message added:', sender, message.substring(0, 50) + '...');
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
                <div class="message-text">AI is thinking...</div>
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
        
        if (lowerMessage.includes('recession') || lowerMessage.includes('protection')) {
            return `Based on current economic conditions, I recommend a defensive portfolio allocation: 25% Government Bonds for stability, 20% Cash/Money Markets for liquidity, 20% Defensive Stocks (utilities, consumer staples), 15% Gold/Precious Metals as inflation hedge, 10% Emerging Markets for growth, and 10% Alternative Investments for diversification. Your current portfolio shows good energy sector exposure through PETR4, which historically performs well during inflationary periods.`;
        }
        
        if (lowerMessage.includes('brazil') || lowerMessage.includes('outlook')) {
            return `Brazil's economic outlook shows mixed signals. The Central Bank's 11.75% Selic rate is helping combat inflation (currently 4.2%), but this creates headwinds for growth. Your ITUB3 position (+82.3%) reflects strong banking sector performance due to high interest rates. However, consider diversifying internationally as 100% Brazil concentration increases country risk. The Real's stability around 5.12 USD/BRL suggests relative economic balance.`;
        }
        
        if (lowerMessage.includes('inflation') || lowerMessage.includes('hedge')) {
            return `For inflation protection, consider: 1) Real Assets - Your PETR4 position (+21.3%) is excellent as energy tracks inflation. 2) REITs - Your KNRI11 and HGLG11 provide real estate exposure, though currently down. 3) International diversification - Consider USD or EUR assets. 4) Commodities - Gold is at $1,950/oz, historically strong against inflation. Your current allocation has good inflation hedge characteristics but could benefit from more international exposure.`;
        }
        
        if (lowerMessage.includes('optimize') || lowerMessage.includes('portfolio')) {
            return `Portfolio optimization analysis: Your Sharpe ratio of 0.87 is solid, but concentration risk is high. Recommendations: 1) Reduce ITUB3 position (currently 29% of portfolio) - take some profits. 2) Your energy exposure via PETR4 is well-positioned. 3) REITs are temporarily weak but provide good dividend income. 4) Add international diversification - consider global ETFs. 5) Your beta of 1.15 suggests higher volatility than market - consider adding defensive positions.`;
        }
        
        if (lowerMessage.includes('risk') || lowerMessage.includes('var')) {
            return `Risk Assessment: Your portfolio shows VaR (95%) of 2.3%, meaning potential daily loss of 2.3% in worst 5% of cases. Max drawdown of -8.9% is reasonable. However, high concentration in Brazilian assets increases specific risk. Your Sortino ratio of 1.23 indicates good downside protection. Consider: 1) Geographic diversification, 2) Sector rebalancing, 3) Adding bonds for stability. Current beta of 1.15 means 15% more volatile than market.`;
        }
        
        // Default response
        return `I understand you're asking about ${message}. Based on your current portfolio performance (+18.87% total return), you're in a strong position. Your key holdings show mixed performance with ITUB3 leading at +82.3% while some REITs are temporarily down. Consider diversifying internationally and taking some profits from outperforming positions. Would you like specific recommendations for portfolio optimization or risk management?`;
    }

    optimizePortfolio() {
        this.showLoading('Analyzing portfolio using Modern Portfolio Theory...');
        
        setTimeout(() => {
            this.hideLoading();
            
            // Navigate to chat and add response
            this.navigateToPage('chat');
            setTimeout(() => {
                this.addChatMessage("Portfolio optimization completed! Based on Modern Portfolio Theory analysis, I recommend: Reduce ITUB3 from 29% to 20%, Add 10% international bonds, Add 5% US tech ETF, Increase cash position to 10% for opportunities. This should improve your Sharpe ratio to ~1.1 while reducing overall risk.", 'ai');
            }, 500);
        }, 2000);
    }

    rebalancePortfolio() {
        this.showLoading('Calculating optimal rebalancing strategy...');
        
        setTimeout(() => {
            this.hideLoading();
            alert('Portfolio rebalancing simulation completed! Theoretical new allocation would reduce concentration risk and improve diversification. Check the AI Chat for detailed recommendations.');
        }, 1500);
    }

    exportReport() {
        try {
            const reportData = {
                portfolio: this.portfolioData,
                risk_metrics: this.riskMetrics,
                economic_data: this.economicData,
                generated_at: new Date().toISOString()
            };
            
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `portfolio_report_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            
            console.log('Report exported successfully');
        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Error exporting report. Please try again.');
        }
    }

    refreshEconomicData() {
        console.log('Refreshing economic data...');
        
        // Simulate real-time data refresh
        const indicators = document.querySelectorAll('.indicator-value');
        indicators.forEach(indicator => {
            indicator.style.opacity = '0.5';
            setTimeout(() => {
                // Simulate slight data changes
                const currentText = indicator.textContent;
                const currentValue = parseFloat(currentText.replace(/[^0-9.-]/g, ''));
                const change = (Math.random() - 0.5) * 0.1;
                const newValue = (currentValue + change).toFixed(2);
                
                if (currentText.includes('$')) {
                    indicator.textContent = `$${newValue}`;
                } else if (currentText.includes('%')) {
                    indicator.textContent = `${newValue}%`;
                } else {
                    indicator.textContent = newValue;
                }
                
                indicator.style.opacity = '1';
            }, 500);
        });
    }

    simulateRealTimeUpdates() {
        if (!this.isInitialized) return;
        
        // Update portfolio value periodically with smaller, more realistic changes
        setInterval(() => {
            const valueElement = document.getElementById('portfolioValue');
            if (valueElement && this.currentPage === 'dashboard') {
                try {
                    const currentText = valueElement.textContent.replace(/[^0-9.]/g, '');
                    const currentValue = parseFloat(currentText);
                    
                    if (!isNaN(currentValue) && currentValue > 100000) { // Safety check
                        const change = (Math.random() - 0.48) * 500; // Much smaller changes
                        const newValue = Math.max(250000, currentValue + change); // Floor value
                        valueElement.textContent = newValue.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                    }
                } catch (error) {
                    console.error('Error updating portfolio value:', error);
                }
            }
        }, 60000); // Update every minute instead of 30 seconds
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) {
            console.warn('Theme toggle not found');
            return;
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            
            // Update charts for theme change
            setTimeout(() => {
                Object.values(this.charts).forEach(chart => {
                    if (chart && chart.update) {
                        chart.update();
                    }
                });
            }, 100);
            
            console.log('Theme changed to:', newTheme);
        });
    }

    setupRiskSlider() {
        const riskSlider = document.getElementById('riskLevel');
        const riskValue = document.getElementById('riskLevelValue');
        
        if (riskSlider && riskValue) {
            const riskLabels = ['Conservative', 'Cautious', 'Moderate', 'Aggressive', 'Very Aggressive'];
            
            riskSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                riskValue.textContent = riskLabels[value - 1];
            });
            
            console.log('Risk slider initialized');
        }
    }

    showLoading(message = 'Processing your request...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.querySelector('.loading-text');
        
        if (overlay) {
            if (loadingText) {
                loadingText.textContent = message;
            }
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    // Data generation methods
    generatePortfolioPerformanceData() {
        const labels = [];
        const values = [];
        const baseValue = 280000;
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('pt-BR', {month: 'short', day: 'numeric'}));
            
            const trend = (30 - i) * 700; // Gradual upward trend
            const volatility = (Math.random() - 0.5) * 3000; // Reduced volatility
            values.push(Math.round(baseValue + trend + volatility));
        }
        
        return {labels, values};
    }

    generateMarketData() {
        const labels = [];
        const ibovespa = [];
        const sp500 = [];
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('pt-BR', {month: 'short', day: 'numeric'}));
            
            const iboTrend = 120000 + (30 - i) * 300;
            const spTrend = 4200 + (30 - i) * 15;
            
            ibovespa.push(Math.round(iboTrend + (Math.random() - 0.5) * 1500));
            sp500.push(Math.round(spTrend + (Math.random() - 0.5) * 80));
        }
        
        return {labels, ibovespa, sp500};
    }

    calculatePortfolioAllocations() {
        const totalValue = this.portfolioData.total_value;
        const labels = [];
        const values = [];
        
        this.portfolioData.holdings.forEach(holding => {
            labels.push(holding.symbol);
            values.push(parseFloat(((holding.value / totalValue) * 100).toFixed(1)));
        });
        
        return {labels, values};
    }

    generateEconomicTrendData() {
        const labels = [];
        const inflation = [];
        const selic = [];
        
        for (let i = 12; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            labels.push(date.toLocaleDateString('pt-BR', {month: 'short', year: '2-digit'}));
            
            inflation.push(parseFloat((4.5 + (Math.random() - 0.5) * 1.5).toFixed(2)));
            selic.push(parseFloat((11.5 + (Math.random() - 0.5) * 0.8).toFixed(2)));
        }
        
        return {labels, inflation, selic};
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Economic Advisor...');
    window.economicAdvisor = new EconomicAdvisor();
});