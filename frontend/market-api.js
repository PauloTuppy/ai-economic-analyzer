// Market Data API - Real-time market data simulation
class MarketDataAPI {
    constructor() {
        this.baseUrl = 'https://api.hgbrasil.com/finance';
        this.fallbackData = {
            IBOV: { price: 120000, change: 0.5 },
            PETR4: { price: 19.80, change: 2.1 },
            ITUB3: { price: 80.00, change: 1.5 },
            BIDI4: { price: 18.40, change: -0.8 },
            USDBRL: { price: 5.12, change: -0.02 }
        };
        this.subscribers = [];
        this.updateInterval = null;
    }

    // Subscribe to real-time updates
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    // Start real-time updates
    startRealTimeUpdates(intervalMs = 30000) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.fetchMarketData().then(data => {
                this.notifySubscribers(data);
            });
        }, intervalMs);

        console.log('📊 Market data updates started');
    }

    // Stop real-time updates
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Fetch market data (with fallback to simulation)
    async fetchMarketData() {
        try {
            // Try to fetch real data first
            const response = await fetch(`${this.baseUrl}/stock_price?key=free&symbol=PETR4,ITUB3,BIDI4`);
            
            if (response.ok) {
                const data = await response.json();
                return this.processRealData(data);
            } else {
                throw new Error('API unavailable');
            }
        } catch (error) {
            console.warn('Using simulated market data:', error.message);
            return this.generateSimulatedData();
        }
    }

    // Process real API data
    processRealData(apiData) {
        const processed = {};
        
        if (apiData.results && apiData.results.stocks) {
            Object.entries(apiData.results.stocks).forEach(([symbol, data]) => {
                processed[symbol] = {
                    price: data.price,
                    change: data.change_percent,
                    volume: data.volume,
                    timestamp: new Date().toISOString()
                };
            });
        }

        // Add market indices
        if (apiData.results && apiData.results.currencies) {
            processed.USDBRL = {
                price: apiData.results.currencies.USD.buy,
                change: apiData.results.currencies.USD.variation,
                timestamp: new Date().toISOString()
            };
        }

        return processed;
    }

    // Generate simulated market data
    generateSimulatedData() {
        const simulated = {};
        
        Object.entries(this.fallbackData).forEach(([symbol, baseData]) => {
            // Generate realistic price movements
            const volatility = this.getVolatility(symbol);
            const randomChange = (Math.random() - 0.5) * volatility;
            const newPrice = baseData.price * (1 + randomChange);
            const changePercent = ((newPrice - baseData.price) / baseData.price) * 100;

            simulated[symbol] = {
                price: parseFloat(newPrice.toFixed(2)),
                change: parseFloat(changePercent.toFixed(2)),
                volume: Math.floor(Math.random() * 1000000) + 100000,
                timestamp: new Date().toISOString(),
                simulated: true
            };

            // Update base data for next iteration
            this.fallbackData[symbol].price = newPrice;
        });

        // Add economic indicators
        simulated.ECONOMIC = {
            brazil_inflation: 4.2 + (Math.random() - 0.5) * 0.1,
            selic_rate: 11.75,
            oil_price: 82.50 + (Math.random() - 0.5) * 2,
            gold_price: 1950 + (Math.random() - 0.5) * 20,
            timestamp: new Date().toISOString()
        };

        return simulated;
    }

    // Get volatility based on asset type
    getVolatility(symbol) {
        const volatilities = {
            IBOV: 0.02,    // 2% max change
            PETR4: 0.03,   // 3% max change
            ITUB3: 0.025,  // 2.5% max change
            BIDI4: 0.035,  // 3.5% max change
            USDBRL: 0.01   // 1% max change
        };
        
        return volatilities[symbol] || 0.02;
    }

    // Notify all subscribers
    notifySubscribers(data) {
        this.subscribers.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error notifying subscriber:', error);
            }
        });
    }

    // Get historical data (simulated)
    async getHistoricalData(symbol, days = 30) {
        const data = [];
        const basePrice = this.fallbackData[symbol]?.price || 100;
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const trend = Math.sin(i * 0.1) * 0.1;
            const noise = (Math.random() - 0.5) * 0.05;
            const price = basePrice * (1 + trend + noise);
            
            data.push({
                date: date.toISOString().split('T')[0],
                price: parseFloat(price.toFixed(2)),
                volume: Math.floor(Math.random() * 1000000) + 100000
            });
        }
        
        return data;
    }

    // Get market predictions (using simple technical analysis)
    async getMarketPredictions(symbol) {
        try {
            const historical = await this.getHistoricalData(symbol, 20);
            const prices = historical.map(d => d.price);
            
            // Simple moving averages
            const sma5 = this.calculateSMA(prices, 5);
            const sma20 = this.calculateSMA(prices, 20);
            
            // RSI calculation
            const rsi = this.calculateRSI(prices, 14);
            
            // Trend analysis
            const trend = sma5 > sma20 ? 'Bullish' : 'Bearish';
            const strength = Math.abs(sma5 - sma20) / sma20;
            
            // Price prediction (simple linear regression)
            const prediction = this.predictNextPrice(prices);
            
            return {
                symbol,
                current_price: prices[prices.length - 1],
                predicted_price: prediction,
                trend,
                strength: strength.toFixed(3),
                rsi: rsi.toFixed(2),
                sma5: sma5.toFixed(2),
                sma20: sma20.toFixed(2),
                recommendation: this.getRecommendation(rsi, trend),
                confidence: this.calculateConfidence(rsi, strength),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error generating predictions:', error);
            return null;
        }
    }

    // Technical analysis helpers
    calculateSMA(prices, period) {
        const slice = prices.slice(-period);
        return slice.reduce((sum, price) => sum + price, 0) / slice.length;
    }

    calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) return 50;
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i <= period; i++) {
            const change = prices[prices.length - i] - prices[prices.length - i - 1];
            if (change > 0) gains += change;
            else losses -= change;
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        
        return 100 - (100 / (1 + rs));
    }

    predictNextPrice(prices) {
        // Simple linear regression for next price
        const n = Math.min(prices.length, 10); // Use last 10 prices
        const recentPrices = prices.slice(-n);
        
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        
        recentPrices.forEach((price, i) => {
            sumX += i;
            sumY += price;
            sumXY += i * price;
            sumXX += i * i;
        });
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return parseFloat((slope * n + intercept).toFixed(2));
    }

    getRecommendation(rsi, trend) {
        if (rsi > 70) return 'Sell';
        if (rsi < 30) return 'Buy';
        if (trend === 'Bullish' && rsi > 50) return 'Hold/Buy';
        if (trend === 'Bearish' && rsi < 50) return 'Hold/Sell';
        return 'Hold';
    }

    calculateConfidence(rsi, strength) {
        let confidence = 0.5; // Base confidence
        
        // RSI confidence
        if (rsi > 70 || rsi < 30) confidence += 0.3;
        else if (rsi > 60 || rsi < 40) confidence += 0.1;
        
        // Trend strength confidence
        confidence += Math.min(strength * 2, 0.2);
        
        return Math.min(confidence, 0.95).toFixed(2);
    }

    // Economic indicators
    async getEconomicIndicators() {
        return {
            brazil: {
                inflation_rate: 4.2 + (Math.random() - 0.5) * 0.1,
                interest_rate: 11.75,
                gdp_growth: 2.8 + (Math.random() - 0.5) * 0.2,
                unemployment: 7.9 + (Math.random() - 0.5) * 0.3
            },
            global: {
                us_inflation: 3.1 + (Math.random() - 0.5) * 0.1,
                us_fed_rate: 5.25,
                eur_inflation: 2.4 + (Math.random() - 0.5) * 0.1,
                oil_price: 82.5 + (Math.random() - 0.5) * 2,
                gold_price: 1950 + (Math.random() - 0.5) * 20
            },
            timestamp: new Date().toISOString()
        };
    }
}

// Export for use in main app
window.MarketDataAPI = MarketDataAPI;