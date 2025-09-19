// Market Strategy Engine based on Hull Tactical Market Prediction
class MarketStrategyEngine {
    constructor() {
        this.MIN_INVESTMENT = 0.0;
        this.MAX_INVESTMENT = 2.0;
        this.models = {
            ruleBasedWeight: 0.45,
            exposureWeight: 0.35,
            elasticNetWeight: 0.20
        };
        this.parameters = {
            alphaBest: 0.6001322487531852,
            useExcess: false,
            tauAbs: 9.437170708744412e-05,
            signalMultiplier: 400.0
        };
        this.marketData = [];
        this.predictions = [];
    }

    // Model 1: Rule-based prediction
    predictRuleBased(forwardReturn) {
        return forwardReturn > 0 ? 0.09 : 0.0;
    }

    // Model 2: Exposure-based prediction
    calculateExposure(returnValue, riskFreeRate = 0.0) {
        const signal = this.parameters.useExcess ? 
            (returnValue - riskFreeRate) : returnValue;
        
        if (signal <= this.parameters.tauAbs) {
            return 0.0;
        }
        return this.parameters.alphaBest;
    }

    predictExposure(forwardReturn) {
        const exposure = this.calculateExposure(forwardReturn);
        return Math.max(this.MIN_INVESTMENT, 
               Math.min(exposure, this.MAX_INVESTMENT));
    }

    // Model 3: ElasticNet signal prediction
    convertReturnToSignal(returnValue) {
        const signal = returnValue * this.parameters.signalMultiplier + 1;
        return Math.max(this.MIN_INVESTMENT, 
               Math.min(signal, this.MAX_INVESTMENT));
    }

    predictElasticNet(forwardReturn) {
        return this.convertReturnToSignal(forwardReturn);
    }

    // Ensemble prediction combining all models
    ensemblePredict(forwardReturn) {
        const p1 = this.predictRuleBased(forwardReturn);
        const p2 = this.predictExposure(forwardReturn);
        const p3 = this.predictElasticNet(forwardReturn);

        const ensemble = (
            this.models.ruleBasedWeight * p1 +
            this.models.exposureWeight * p2 +
            this.models.elasticNetWeight * p3
        );

        return Math.max(this.MIN_INVESTMENT, 
               Math.min(ensemble, this.MAX_INVESTMENT));
    }

    // Generate market signals based on current data
    generateMarketSignals(marketData) {
        const signals = [];
        
        for (const dataPoint of marketData) {
            const prediction = this.ensemblePredict(dataPoint.return);
            const signal = {
                date: dataPoint.date,
                prediction: prediction,
                confidence: this.calculateConfidence(prediction),
                recommendation: this.getRecommendation(prediction),
                riskLevel: this.assessRisk(prediction)
            };
            signals.push(signal);
        }

        return signals;
    }

    calculateConfidence(prediction) {
        // Higher predictions generally indicate higher confidence
        if (prediction > 1.5) return 'High';
        if (prediction > 0.5) return 'Medium';
        if (prediction > 0.1) return 'Low';
        return 'Very Low';
    }

    getRecommendation(prediction) {
        if (prediction > 1.5) return 'Strong Buy';
        if (prediction > 1.0) return 'Buy';
        if (prediction > 0.5) return 'Hold';
        if (prediction > 0.1) return 'Cautious';
        return 'Defensive';
    }

    assessRisk(prediction) {
        if (prediction > 1.5) return 'High';
        if (prediction > 1.0) return 'Medium-High';
        if (prediction > 0.5) return 'Medium';
        if (prediction > 0.1) return 'Low-Medium';
        return 'Low';
    }

    // Portfolio optimization based on predictions
    optimizePortfolio(currentHoldings, marketSignals) {
        const recommendations = [];
        
        for (const holding of currentHoldings) {
            const signal = this.getSignalForAsset(holding.symbol, marketSignals);
            const currentWeight = holding.value / this.getTotalPortfolioValue(currentHoldings);
            
            let recommendedWeight = currentWeight;
            let action = 'Hold';
            
            if (signal && signal.prediction > 1.0) {
                recommendedWeight = Math.min(currentWeight * 1.2, 0.25); // Max 25% per asset
                action = 'Increase';
            } else if (signal && signal.prediction < 0.3) {
                recommendedWeight = currentWeight * 0.8;
                action = 'Reduce';
            }

            recommendations.push({
                symbol: holding.symbol,
                currentWeight: (currentWeight * 100).toFixed(1) + '%',
                recommendedWeight: (recommendedWeight * 100).toFixed(1) + '%',
                action: action,
                reasoning: this.getReasoningForAction(signal, action)
            });
        }

        return recommendations;
    }

    getSignalForAsset(symbol, marketSignals) {
        // In a real implementation, this would map symbols to market signals
        // For now, we'll use the latest signal as a proxy
        return marketSignals.length > 0 ? marketSignals[marketSignals.length - 1] : null;
    }

    getTotalPortfolioValue(holdings) {
        return holdings.reduce((total, holding) => total + holding.value, 0);
    }

    getReasoningForAction(signal, action) {
        if (!signal) return 'Insufficient data for analysis';
        
        const reasonings = {
            'Increase': `Strong market signal (${signal.prediction.toFixed(2)}) suggests favorable conditions`,
            'Reduce': `Weak market signal (${signal.prediction.toFixed(2)}) indicates potential downside`,
            'Hold': `Neutral market signal (${signal.prediction.toFixed(2)}) supports current allocation`
        };

        return reasonings[action] || 'Standard portfolio maintenance';
    }

    // Generate synthetic market data for demonstration
    generateSyntheticMarketData(days = 30) {
        const data = [];
        const baseDate = new Date();
        
        for (let i = 0; i < days; i++) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() - (days - i));
            
            // Generate synthetic return data
            const trend = Math.sin(i * 0.1) * 0.02;
            const noise = (Math.random() - 0.5) * 0.05;
            const marketReturn = trend + noise;
            
            data.push({
                date: date.toISOString().split('T')[0],
                return: marketReturn,
                volume: Math.random() * 1000000 + 500000,
                volatility: Math.abs(noise) * 10
            });
        }
        
        return data;
    }

    // Real-time market analysis
    analyzeCurrentMarket() {
        const syntheticData = this.generateSyntheticMarketData();
        const signals = this.generateMarketSignals(syntheticData);
        const latestSignal = signals[signals.length - 1];

        return {
            currentSignal: latestSignal,
            trend: this.calculateTrend(signals),
            volatility: this.calculateVolatility(syntheticData),
            recommendation: this.getOverallRecommendation(signals)
        };
    }

    calculateTrend(signals) {
        if (signals.length < 5) return 'Insufficient data';
        
        const recent = signals.slice(-5);
        const avgPrediction = recent.reduce((sum, s) => sum + s.prediction, 0) / recent.length;
        
        if (avgPrediction > 1.0) return 'Bullish';
        if (avgPrediction > 0.5) return 'Neutral-Bullish';
        if (avgPrediction > 0.2) return 'Neutral';
        return 'Bearish';
    }

    calculateVolatility(marketData) {
        if (marketData.length < 2) return 'Unknown';
        
        const returns = marketData.map(d => d.return);
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
        const volatility = Math.sqrt(variance);
        
        if (volatility > 0.03) return 'High';
        if (volatility > 0.02) return 'Medium';
        return 'Low';
    }

    getOverallRecommendation(signals) {
        const latestSignals = signals.slice(-3);
        const avgPrediction = latestSignals.reduce((sum, s) => sum + s.prediction, 0) / latestSignals.length;
        
        if (avgPrediction > 1.2) return 'Aggressive Growth Strategy';
        if (avgPrediction > 0.8) return 'Moderate Growth Strategy';
        if (avgPrediction > 0.4) return 'Balanced Strategy';
        if (avgPrediction > 0.2) return 'Conservative Strategy';
        return 'Defensive Strategy';
    }
}

// Export for use in main app
window.MarketStrategyEngine = MarketStrategyEngine;