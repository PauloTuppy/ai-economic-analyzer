// AI Economic Advisor Application - English Version
class EconomicAdvisorEN extends EconomicAdvisor {
    constructor() {
        super();
        this.language = 'en';
        this.currency = 'USD';
        
        // Override portfolio data for USD display
        this.portfolioData = {
            total_value: 60145.46, // Converted from BRL to USD
            total_return: 0.1887,
            holdings: [
                {symbol: "PETR4", quantity: 3600, purchase_price: 3.19, current_price: 3.86, value: 13900.8, return: 0.213},
                {symbol: "ITUB3", quantity: 1100, purchase_price: 8.57, current_price: 15.63, value: 17193, return: 0.823},
                {symbol: "BIDI4", quantity: 2164, purchase_price: 3.68, current_price: 3.59, value: 7768.76, return: -0.025},
                {symbol: "KNRI11", quantity: 180, purchase_price: 32.28, current_price: 31.93, value: 5747.4, return: -0.011},
                {symbol: "HGLG11", quantity: 220, purchase_price: 27.24, current_price: 26.02, value: 5724.4, return: -0.045},
                {symbol: "SNSL3", quantity: 1100, purchase_price: 5.27, current_price: 5.08, value: 5588, return: -0.036},
                {symbol: "BCFF11", quantity: 180, purchase_price: 16.48, current_price: 15.72, value: 2829.6, return: -0.046}
            ]
        };
        
        // Override economic data for international context
        this.economicData = {
            brazil_inflation: 4.2,
            selic_rate: 11.75,
            usd_brl: 5.12,
            oil_price: 82.50,
            us_inflation: 3.1,
            fed_rate: 5.25,
            sp500: 4200,
            nasdaq: 13000
        };
    }

    initializeApp() {
        console.log('🚀 Initializing AI Economic Advisor (English)...');
        
        // Set language to English
        if (window.i18n) {
            window.i18n.setLanguage('en');
        }
        
        // Call parent initialization
        super.initializeApp();
        
        // Setup language-specific features
        this.setupLanguageControls();
    }

    setupLanguageControls() {
        const languageSelect = document.getElementById('languageSelect');
        const currencySelect = document.getElementById('currencySelect');
        
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                const newLang = e.target.value;
                if (window.i18n) {
                    window.i18n.setLanguage(newLang);
                }
                
                // Redirect to appropriate version
                if (newLang === 'pt') {
                    window.location.href = 'index.html';
                }
            });
        }
        
        if (currencySelect) {
            currencySelect.addEventListener('change', (e) => {
                this.currency = e.target.value;
                this.updateCurrencyDisplay();
            });
        }
    }

    updateCurrencyDisplay() {
        // Update portfolio value display
        const portfolioValueEl = document.getElementById('portfolioValue');
        if (portfolioValueEl) {
            const value = this.currency === 'USD' ? 
                this.portfolioData.total_value : 
                this.portfolioData.total_value * 5.12; // Convert to BRL
            
            portfolioValueEl.textContent = this.formatCurrency(value, this.currency);
        }
        
        // Update holdings table
        this.populateHoldingsTable();
    }

    formatCurrency(value, currency = null) {
        const curr = currency || this.currency;
        const symbol = curr === 'USD' ? '$' : 'R$';
        
        return symbol + new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
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
            
            // Convert prices if needed
            const price = this.currency === 'USD' ? holding.current_price : holding.current_price * 5.12;
            const value = this.currency === 'USD' ? holding.value : holding.value * 5.12;
            
            row.innerHTML = `
                <div class="symbol">${holding.symbol}</div>
                <div>${holding.quantity.toLocaleString()}</div>
                <div>${this.formatCurrency(price)}</div>
                <div>${this.formatCurrency(value)}</div>
                <div class="return-cell ${returnClass}">${returnPercent}%</div>
            `;
            
            tableBody.appendChild(row);
        });
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
            "Financial sector showing strong momentum with ITUB3 leading at +82.3%",
            "Energy exposure through PETR4 provides effective inflation hedge",
            "Consider diversifying beyond Brazilian market for risk reduction"
        ];

        const insightElements = document.querySelectorAll('.insight-text');
        insights.forEach((insight, index) => {
            if (insightElements[index]) {
                insightElements[index].textContent = insight;
            }
        });
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        const responses = {
            'brazil': 'Brazilian markets present opportunities with Selic at 11.75%. I recommend maintaining exposure to banks and energy, but diversifying internationally.',
            'inflation': 'With inflation at 4.2%, PETR4 and REITs offer protection. Consider IPCA-indexed bonds as well.',
            'risk': 'Your VaR of 2.3% and Sharpe of 0.87 are solid. Consider reducing Brazilian concentration.',
            'optimize': 'Recommendations: 1) Reduce ITUB3 to 20%, 2) Add international exposure, 3) Increase cash for opportunities.'
        };
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return 'Based on your portfolio (+18.87%), you\'re well positioned. ITUB3 leads with +82.3%. I can help with specific analyses if needed.';
    }

    async optimizePortfolio() {
        this.showLoading('Analyzing portfolio with AI...');
        
        try {
            // Simulate AI analysis
            await this.delay(2000);
            
            const recommendations = [
                "Reduce ITUB3 from 29% to 20% - take profits",
                "Increase international exposure by 10%",
                "Add 5% government bonds",
                "Maintain PETR4 as inflation hedge"
            ];
            
            this.hideLoading();
            this.navigateToPage('chat');
            
            setTimeout(() => {
                const message = `🤖 **Portfolio Optimization Complete**\n\n**Recommendations:**\n${recommendations.map(r => `• ${r}`).join('\n')}\n\n**New Estimated Sharpe Ratio:** 1.1\n**Risk Reduction:** 15%`;
                this.addChatMessage(message, 'ai');
            }, 500);
            
        } catch (error) {
            this.hideLoading();
            console.error('Portfolio optimization error:', error);
        }
    }

    rebalancePortfolio() {
        this.showLoading('Calculating rebalancing strategy...');
        
        setTimeout(() => {
            this.hideLoading();
            alert('✅ Rebalancing simulation completed!\n\nRecommendations sent to chat.');
            
            this.navigateToPage('chat');
            setTimeout(() => {
                const message = "📊 **Suggested Rebalancing:**\n\n• Sell 200 ITUB3 shares\n• Buy 500 PETR4 shares\n• Add $3,000 to KNRI11\n\nThis will improve your portfolio diversification.";
                this.addChatMessage(message, 'ai');
            }, 500);
        }, 1500);
    }

    showLoading(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = document.querySelector('.loading-text');
        
        if (overlay && text) {
            text.textContent = message;
            overlay.classList.remove('hidden');
        }
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
        }
    }
}

// Initialize the English version
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.economicAdvisor = new EconomicAdvisorEN();
        console.log('🎉 AI Economic Advisor (English) loaded successfully');
    } catch (error) {
        console.error('💥 Failed to initialize AI Economic Advisor:', error);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EconomicAdvisorEN;
}