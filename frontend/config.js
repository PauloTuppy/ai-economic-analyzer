// Configuration file for AI Economic Advisor
const CONFIG = {
    // Gemini AI Configuration
    GEMINI_API_KEY: 'AIzaSyBbwCAk_HGqfEBkDVbpKlUgjvbO_a46nAw',
    GEMINI_MODEL: 'gemini-pro',
    
    // Market Data Configuration
    UPDATE_INTERVAL: 60000, // 1 minute
    CHART_REFRESH_INTERVAL: 30000, // 30 seconds
    
    // Portfolio Configuration
    DEFAULT_CURRENCY: 'BRL',
    MAX_HOLDINGS: 20,
    MIN_INVESTMENT_AMOUNT: 100,
    
    // Risk Management
    MAX_POSITION_SIZE: 0.25, // 25% max per position
    REBALANCE_THRESHOLD: 0.05, // 5% deviation triggers rebalance
    
    // UI Configuration
    THEME: 'auto', // 'light', 'dark', or 'auto'
    LANGUAGE: 'pt-BR',
    
    // Market Strategy Parameters
    STRATEGY_WEIGHTS: {
        RULE_BASED: 0.45,
        EXPOSURE_BASED: 0.35,
        ELASTIC_NET: 0.20
    },
    
    // Data Sources
    DATA_SOURCES: {
        BRAZILIAN_STOCKS: 'https://api.hgbrasil.com/finance',
        ECONOMIC_INDICATORS: 'https://api.bcb.gov.br/dados/serie',
        INTERNATIONAL_MARKETS: 'https://api.exchangerate-api.com'
    },
    
    // Feature Flags
    FEATURES: {
        REAL_TIME_UPDATES: true,
        AI_CHAT: true,
        PORTFOLIO_OPTIMIZATION: true,
        RISK_ANALYSIS: true,
        MARKET_PREDICTIONS: true
    }
};

// Export configuration
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}