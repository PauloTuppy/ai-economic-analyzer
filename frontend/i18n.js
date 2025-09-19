// Internationalization System for AI Economic Advisor
class I18nManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.loadTranslations();
    }

    loadTranslations() {
        this.translations = {
            en: {
                // Navigation
                'nav.dashboard': 'Dashboard',
                'nav.portfolio': 'Portfolio',
                'nav.economic': 'Economic Analysis',
                'nav.risk': 'Risk Assessment',
                'nav.chat': 'AI Chat',
                'nav.settings': 'Settings',
                'nav.liveMarket': 'Live Market',

                // Dashboard
                'dashboard.portfolioOverview': 'Portfolio Overview',
                'dashboard.keyIndicators': 'Key Economic Indicators',
                'dashboard.aiInsights': 'AI Market Insights',
                'dashboard.liveMarketData': 'Live Market Data',
                'dashboard.sharpeRatio': 'Sharpe Ratio',
                'dashboard.beta': 'Beta',
                'dashboard.var': 'VaR (95%)',
                'dashboard.brazilInflation': 'Brazil Inflation',
                'dashboard.selicRate': 'Selic Rate',
                'dashboard.usdBrl': 'USD/BRL',
                'dashboard.oilPrice': 'Oil Price',
                'dashboard.aiActive': 'Active',

                // Portfolio
                'portfolio.management': 'Portfolio Management',
                'portfolio.aiOptimize': 'AI Optimize',
                'portfolio.rebalance': 'Rebalance',
                'portfolio.exportReport': 'Export Report',
                'portfolio.currentHoldings': 'Current Holdings',
                'portfolio.assetAllocation': 'Asset Allocation',
                'portfolio.symbol': 'Symbol',
                'portfolio.quantity': 'Quantity',
                'portfolio.price': 'Price',
                'portfolio.value': 'Value',
                'portfolio.return': 'Return',

                // Economic Analysis
                'economic.analysis': 'Economic Analysis',
                'economic.globalTrends': 'Global Economic Trends',
                'economic.calendar': 'Economic Calendar',
                'economic.federalReserve': 'Federal Reserve Meeting',
                'economic.brazilGdp': 'Brazil GDP Release',
                'economic.highImpact': 'High Impact',
                'economic.mediumImpact': 'Medium Impact',

                // Risk Assessment
                'risk.assessment': 'Risk Assessment',
                'risk.metrics': 'Risk Metrics',
                'risk.correlationMatrix': 'Correlation Matrix',
                'risk.valueAtRisk': 'Value at Risk (95%)',
                'risk.maxDrawdown': 'Max Drawdown',
                'risk.sortinoRatio': 'Sortino Ratio',
                'risk.dailyLoss': 'Daily loss potential',
                'risk.worstPeriod': 'Worst period performance',
                'risk.downsideRisk': 'Downside risk-adjusted return',

                // Chat
                'chat.aiAdvisor': 'AI Investment Advisor',
                'chat.online': 'Online',
                'chat.welcome': "Hello! I'm your AI Economic Advisor. I can help you analyze your portfolio, understand market conditions, and provide investment recommendations. What would you like to know?",
                'chat.placeholder': 'Ask about markets, portfolio optimization, or economic trends...',
                'chat.send': 'Send',
                'chat.brazilOutlook': 'Brazil Outlook',
                'chat.inflationHedge': 'Inflation Hedge',
                'chat.recessionStrategy': 'Recession Strategy',
                'chat.thinking': 'AI is thinking...',

                // Settings
                'settings.configuration': 'Settings & Configuration',
                'settings.riskTolerance': 'Risk Tolerance',
                'settings.notifications': 'Notifications',
                'settings.languageRegion': 'Language & Region',
                'settings.investmentHorizon': 'Investment Horizon',
                'settings.shortTerm': 'Short Term (1-3 years)',
                'settings.mediumTerm': 'Medium Term (3-7 years)',
                'settings.longTerm': 'Long Term (7+ years)',
                'settings.riskLevel': 'Risk Level',
                'settings.conservative': 'Conservative',
                'settings.moderate': 'Moderate',
                'settings.aggressive': 'Aggressive',
                'settings.portfolioAlerts': 'Portfolio alerts',
                'settings.economicUpdates': 'Economic updates',
                'settings.aiRecommendations': 'AI recommendations',
                'settings.language': 'Language',
                'settings.currency': 'Currency Display',

                // AI Insights
                'insights.financialMomentum': 'Financial sector showing strong momentum with ITUB3 leading at +82.3%',
                'insights.energyHedge': 'Energy exposure through PETR4 provides effective inflation hedge',
                'insights.diversification': 'Consider diversifying beyond Brazilian market for risk reduction',

                // Loading and Messages
                'loading.processing': 'Processing your request...',
                'loading.analyzing': 'Analyzing portfolio with AI...',
                'loading.optimizing': 'Optimizing portfolio using advanced market strategy...',
                'loading.rebalancing': 'Calculating rebalancing strategy...',

                // Recommendations
                'rec.optimizationComplete': 'Portfolio Optimization Complete',
                'rec.recommendations': 'Recommendations',
                'rec.newSharpe': 'New Estimated Sharpe Ratio',
                'rec.riskReduction': 'Risk Reduction',
                'rec.rebalancingComplete': 'Rebalancing Simulation Complete',
                'rec.rebalancingSuggested': 'Rebalancing Suggested',

                // Errors
                'error.chatError': 'Sorry, an error occurred. Please try again.',
                'error.exportError': 'Error exporting report. Please try again.',
                'error.optimizationError': 'Error in optimization. Using standard analysis...',

                // Success Messages
                'success.reportExported': 'Report exported successfully',
                'success.rebalancingComplete': 'Rebalancing simulation completed! Recommendations sent to chat.',

                // Market Predictions
                'predictions.strongBuy': 'Strong Buy',
                'predictions.buy': 'Buy',
                'predictions.hold': 'Hold',
                'predictions.sell': 'Sell',
                'predictions.strongSell': 'Strong Sell',
                'predictions.bullish': 'Bullish',
                'predictions.bearish': 'Bearish',
                'predictions.neutral': 'Neutral',

                // Risk Levels
                'riskLevel.conservative': 'Conservative',
                'riskLevel.cautious': 'Cautious',
                'riskLevel.moderate': 'Moderate',
                'riskLevel.aggressive': 'Aggressive',
                'riskLevel.veryAggressive': 'Very Aggressive'
            },

            pt: {
                // Navigation
                'nav.dashboard': 'Dashboard',
                'nav.portfolio': 'Portfólio',
                'nav.economic': 'Análise Econômica',
                'nav.risk': 'Avaliação de Risco',
                'nav.chat': 'Chat IA',
                'nav.settings': 'Configurações',
                'nav.liveMarket': 'Mercado Ativo',

                // Dashboard
                'dashboard.portfolioOverview': 'Visão Geral do Portfólio',
                'dashboard.keyIndicators': 'Indicadores Econômicos Principais',
                'dashboard.aiInsights': 'Insights de IA do Mercado',
                'dashboard.liveMarketData': 'Dados de Mercado em Tempo Real',
                'dashboard.sharpeRatio': 'Índice Sharpe',
                'dashboard.beta': 'Beta',
                'dashboard.var': 'VaR (95%)',
                'dashboard.brazilInflation': 'Inflação Brasil',
                'dashboard.selicRate': 'Taxa Selic',
                'dashboard.usdBrl': 'USD/BRL',
                'dashboard.oilPrice': 'Preço do Petróleo',
                'dashboard.aiActive': 'Ativo',

                // Portfolio
                'portfolio.management': 'Gestão de Portfólio',
                'portfolio.aiOptimize': 'Otimizar IA',
                'portfolio.rebalance': 'Rebalancear',
                'portfolio.exportReport': 'Exportar Relatório',
                'portfolio.currentHoldings': 'Posições Atuais',
                'portfolio.assetAllocation': 'Alocação de Ativos',
                'portfolio.symbol': 'Símbolo',
                'portfolio.quantity': 'Quantidade',
                'portfolio.price': 'Preço',
                'portfolio.value': 'Valor',
                'portfolio.return': 'Retorno',

                // Economic Analysis
                'economic.analysis': 'Análise Econômica',
                'economic.globalTrends': 'Tendências Econômicas Globais',
                'economic.calendar': 'Calendário Econômico',
                'economic.federalReserve': 'Reunião do Federal Reserve',
                'economic.brazilGdp': 'Divulgação PIB Brasil',
                'economic.highImpact': 'Alto Impacto',
                'economic.mediumImpact': 'Médio Impacto',

                // Risk Assessment
                'risk.assessment': 'Avaliação de Risco',
                'risk.metrics': 'Métricas de Risco',
                'risk.correlationMatrix': 'Matriz de Correlação',
                'risk.valueAtRisk': 'Value at Risk (95%)',
                'risk.maxDrawdown': 'Drawdown Máximo',
                'risk.sortinoRatio': 'Índice Sortino',
                'risk.dailyLoss': 'Potencial de perda diária',
                'risk.worstPeriod': 'Pior performance do período',
                'risk.downsideRisk': 'Retorno ajustado ao risco negativo',

                // Chat
                'chat.aiAdvisor': 'Consultor de Investimentos IA',
                'chat.online': 'Online',
                'chat.welcome': 'Olá! Sou seu Consultor Econômico IA. Posso ajudar você a analisar seu portfólio, entender as condições do mercado e fornecer recomendações de investimento. O que gostaria de saber?',
                'chat.placeholder': 'Pergunte sobre mercados, otimização de portfólio ou tendências econômicas...',
                'chat.send': 'Enviar',
                'chat.brazilOutlook': 'Perspectiva Brasil',
                'chat.inflationHedge': 'Proteção Inflação',
                'chat.recessionStrategy': 'Estratégia Recessão',
                'chat.thinking': 'IA está pensando...',

                // Settings
                'settings.configuration': 'Configurações',
                'settings.riskTolerance': 'Tolerância ao Risco',
                'settings.notifications': 'Notificações',
                'settings.languageRegion': 'Idioma e Região',
                'settings.investmentHorizon': 'Horizonte de Investimento',
                'settings.shortTerm': 'Curto Prazo (1-3 anos)',
                'settings.mediumTerm': 'Médio Prazo (3-7 anos)',
                'settings.longTerm': 'Longo Prazo (7+ anos)',
                'settings.riskLevel': 'Nível de Risco',
                'settings.conservative': 'Conservador',
                'settings.moderate': 'Moderado',
                'settings.aggressive': 'Agressivo',
                'settings.portfolioAlerts': 'Alertas de portfólio',
                'settings.economicUpdates': 'Atualizações econômicas',
                'settings.aiRecommendations': 'Recomendações IA',
                'settings.language': 'Idioma',
                'settings.currency': 'Exibição de Moeda',

                // AI Insights
                'insights.financialMomentum': 'Setor financeiro mostra forte momentum com ITUB3 liderando em +82,3%',
                'insights.energyHedge': 'Exposição energética através de PETR4 oferece proteção efetiva contra inflação',
                'insights.diversification': 'Considere diversificar além do mercado brasileiro para redução de risco',

                // Loading and Messages
                'loading.processing': 'Processando sua solicitação...',
                'loading.analyzing': 'Analisando portfólio com IA...',
                'loading.optimizing': 'Otimizando portfólio usando estratégia de mercado avançada...',
                'loading.rebalancing': 'Calculando estratégia de rebalanceamento...',

                // Recommendations
                'rec.optimizationComplete': 'Otimização de Portfólio Concluída',
                'rec.recommendations': 'Recomendações',
                'rec.newSharpe': 'Novo Índice Sharpe Estimado',
                'rec.riskReduction': 'Redução de Risco',
                'rec.rebalancingComplete': 'Simulação de Rebalanceamento Concluída',
                'rec.rebalancingSuggested': 'Rebalanceamento Sugerido',

                // Errors
                'error.chatError': 'Desculpe, ocorreu um erro. Tente novamente.',
                'error.exportError': 'Erro ao exportar relatório. Tente novamente.',
                'error.optimizationError': 'Erro na otimização. Usando análise padrão...',

                // Success Messages
                'success.reportExported': 'Relatório exportado com sucesso',
                'success.rebalancingComplete': 'Simulação de rebalanceamento concluída! Recomendações enviadas para o chat.',

                // Market Predictions
                'predictions.strongBuy': 'Compra Forte',
                'predictions.buy': 'Compra',
                'predictions.hold': 'Manter',
                'predictions.sell': 'Venda',
                'predictions.strongSell': 'Venda Forte',
                'predictions.bullish': 'Alta',
                'predictions.bearish': 'Baixa',
                'predictions.neutral': 'Neutro',

                // Risk Levels
                'riskLevel.conservative': 'Conservador',
                'riskLevel.cautious': 'Cauteloso',
                'riskLevel.moderate': 'Moderado',
                'riskLevel.aggressive': 'Agressivo',
                'riskLevel.veryAggressive': 'Muito Agressivo'
            }
        };
    }

    // Set current language
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.updateUI();
            localStorage.setItem('ai-advisor-language', lang);
        }
    }

    // Get translation for a key
    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] || key;
        
        // Replace parameters in translation
        return Object.keys(params).reduce((text, param) => {
            return text.replace(`{{${param}}}`, params[param]);
        }, translation);
    }

    // Update UI with current language
    updateUI() {
        // Update navigation
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
    }

    // Initialize from localStorage
    init() {
        const savedLang = localStorage.getItem('ai-advisor-language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        } else {
            // Detect browser language
            const browserLang = navigator.language.split('-')[0];
            if (this.translations[browserLang]) {
                this.currentLanguage = browserLang;
            }
        }
        
        this.updateUI();
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    // Format currency based on language
    formatCurrency(amount, currency = 'USD') {
        const locale = this.currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
        
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Format number based on language
    formatNumber(number, options = {}) {
        const locale = this.currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
        
        return new Intl.NumberFormat(locale, options).format(number);
    }

    // Format percentage
    formatPercentage(value) {
        const locale = this.currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
        
        return new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        }).format(value / 100);
    }

    // Format date based on language
    formatDate(date, options = {}) {
        const locale = this.currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
        
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...options
        }).format(new Date(date));
    }
}

// Create global instance
window.i18n = new I18nManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.i18n.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
}