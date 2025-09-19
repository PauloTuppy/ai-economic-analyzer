// Advanced Market Predictions System
class MarketPredictionsEngine {
    constructor() {
        this.models = {
            technical: new TechnicalAnalysisModel(),
            sentiment: new SentimentAnalysisModel(),
            economic: new EconomicIndicatorsModel(),
            ml: new MachineLearningModel()
        };
        this.predictions = new Map();
        this.confidence = new Map();
    }

    // Generate comprehensive market predictions
    async generatePredictions(symbol, timeframe = '1d') {
        try {
            const predictions = await Promise.all([
                this.models.technical.predict(symbol, timeframe),
                this.models.sentiment.predict(symbol, timeframe),
                this.models.economic.predict(symbol, timeframe),
                this.models.ml.predict(symbol, timeframe)
            ]);

            const ensemble = this.ensemblePredictions(predictions);
            const confidence = this.calculateConfidence(predictions);
            
            this.predictions.set(symbol, ensemble);
            this.confidence.set(symbol, confidence);

            return {
                symbol,
                timeframe,
                prediction: ensemble,
                confidence,
                models: {
                    technical: predictions[0],
                    sentiment: predictions[1],
                    economic: predictions[2],
                    ml: predictions[3]
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Prediction error:', error);
            return this.getFallbackPrediction(symbol, timeframe);
        }
    }

    // Ensemble multiple model predictions
    ensemblePredictions(predictions) {
        const weights = [0.3, 0.2, 0.25, 0.25]; // Technical, Sentiment, Economic, ML
        let weightedSum = 0;
        let totalWeight = 0;

        predictions.forEach((pred, index) => {
            if (pred && pred.direction !== undefined) {
                weightedSum += pred.direction * weights[index];
                totalWeight += weights[index];
            }
        });

        const direction = totalWeight > 0 ? weightedSum / totalWeight : 0;
        
        return {
            direction: Math.max(-1, Math.min(1, direction)),
            strength: Math.abs(direction),
            recommendation: this.getRecommendation(direction),
            target_price: this.calculateTargetPrice(predictions),
            risk_level: this.calculateRiskLevel(predictions)
        };
    }

    calculateConfidence(predictions) {
        const validPredictions = predictions.filter(p => p && p.confidence !== undefined);
        if (validPredictions.length === 0) return 0.5;

        const avgConfidence = validPredictions.reduce((sum, p) => sum + p.confidence, 0) / validPredictions.length;
        const consensus = this.calculateConsensus(predictions);
        
        return Math.min(0.95, avgConfidence * consensus);
    }

    calculateConsensus(predictions) {
        const directions = predictions
            .filter(p => p && p.direction !== undefined)
            .map(p => p.direction > 0 ? 1 : p.direction < 0 ? -1 : 0);
        
        if (directions.length === 0) return 0.5;
        
        const positive = directions.filter(d => d > 0).length;
        const negative = directions.filter(d => d < 0).length;
        const neutral = directions.filter(d => d === 0).length;
        
        const maxCount = Math.max(positive, negative, neutral);
        return maxCount / directions.length;
    }

    getRecommendation(direction) {
        if (direction > 0.3) return 'Strong Buy';
        if (direction > 0.1) return 'Buy';
        if (direction > -0.1) return 'Hold';
        if (direction > -0.3) return 'Sell';
        return 'Strong Sell';
    }

    calculateTargetPrice(predictions) {
        const targets = predictions
            .filter(p => p && p.target_price)
            .map(p => p.target_price);
        
        if (targets.length === 0) return null;
        
        return targets.reduce((sum, price) => sum + price, 0) / targets.length;
    }

    calculateRiskLevel(predictions) {
        const risks = predictions
            .filter(p => p && p.risk_level !== undefined)
            .map(p => p.risk_level);
        
        if (risks.length === 0) return 0.5;
        
        return risks.reduce((sum, risk) => sum + risk, 0) / risks.length;
    }

    getFallbackPrediction(symbol, timeframe) {
        return {
            symbol,
            timeframe,
            prediction: {
                direction: (Math.random() - 0.5) * 0.4,
                strength: Math.random() * 0.5 + 0.3,
                recommendation: 'Hold',
                target_price: null,
                risk_level: 0.5
            },
            confidence: 0.4,
            models: {},
            fallback: true,
            timestamp: new Date().toISOString()
        };
    }
}

// Technical Analysis Model
class TechnicalAnalysisModel {
    async predict(symbol, timeframe) {
        try {
            // Simulate technical analysis
            const indicators = await this.calculateIndicators(symbol);
            
            let direction = 0;
            let confidence = 0.5;
            
            // RSI analysis
            if (indicators.rsi > 70) {
                direction -= 0.3;
                confidence += 0.1;
            } else if (indicators.rsi < 30) {
                direction += 0.3;
                confidence += 0.1;
            }
            
            // Moving average analysis
            if (indicators.sma5 > indicators.sma20) {
                direction += 0.2;
                confidence += 0.05;
            } else {
                direction -= 0.2;
                confidence += 0.05;
            }
            
            // MACD analysis
            if (indicators.macd > indicators.macd_signal) {
                direction += 0.15;
                confidence += 0.05;
            } else {
                direction -= 0.15;
                confidence += 0.05;
            }
            
            return {
                direction: Math.max(-1, Math.min(1, direction)),
                confidence: Math.min(0.9, confidence),
                indicators,
                target_price: this.calculateTechnicalTarget(indicators),
                risk_level: this.calculateTechnicalRisk(indicators)
            };
        } catch (error) {
            console.error('Technical analysis error:', error);
            return null;
        }
    }

    async calculateIndicators(symbol) {
        // Simulate technical indicators
        return {
            rsi: 45 + (Math.random() - 0.5) * 40,
            sma5: 100 + (Math.random() - 0.5) * 10,
            sma20: 98 + (Math.random() - 0.5) * 8,
            macd: (Math.random() - 0.5) * 2,
            macd_signal: (Math.random() - 0.5) * 1.8,
            bollinger_upper: 105 + Math.random() * 5,
            bollinger_lower: 95 - Math.random() * 5,
            volume_ratio: 0.8 + Math.random() * 0.4
        };
    }

    calculateTechnicalTarget(indicators) {
        const current = (indicators.sma5 + indicators.sma20) / 2;
        const volatility = Math.abs(indicators.bollinger_upper - indicators.bollinger_lower) / current;
        
        if (indicators.rsi > 50) {
            return current * (1 + volatility * 0.5);
        } else {
            return current * (1 - volatility * 0.5);
        }
    }

    calculateTechnicalRisk(indicators) {
        let risk = 0.5;
        
        // High RSI = higher risk
        if (indicators.rsi > 70 || indicators.rsi < 30) risk += 0.2;
        
        // High volatility = higher risk
        const volatility = Math.abs(indicators.bollinger_upper - indicators.bollinger_lower);
        risk += Math.min(0.3, volatility / 100);
        
        return Math.min(0.95, risk);
    }
}

// Sentiment Analysis Model
class SentimentAnalysisModel {
    async predict(symbol, timeframe) {
        try {
            const sentiment = await this.analyzeSentiment(symbol);
            
            let direction = sentiment.score;
            let confidence = sentiment.confidence;
            
            return {
                direction,
                confidence,
                sentiment_score: sentiment.score,
                news_count: sentiment.news_count,
                social_mentions: sentiment.social_mentions,
                target_price: null,
                risk_level: 1 - confidence // Lower confidence = higher risk
            };
        } catch (error) {
            console.error('Sentiment analysis error:', error);
            return null;
        }
    }

    async analyzeSentiment(symbol) {
        // Simulate sentiment analysis
        const newsCount = Math.floor(Math.random() * 50) + 10;
        const socialMentions = Math.floor(Math.random() * 1000) + 100;
        
        // Simulate sentiment score (-1 to 1)
        const score = (Math.random() - 0.5) * 1.6;
        
        // Confidence based on volume of mentions
        const confidence = Math.min(0.8, (newsCount + socialMentions / 10) / 100);
        
        return {
            score,
            confidence,
            news_count: newsCount,
            social_mentions: socialMentions
        };
    }
}

// Economic Indicators Model
class EconomicIndicatorsModel {
    async predict(symbol, timeframe) {
        try {
            const indicators = await this.getEconomicIndicators();
            const impact = this.calculateEconomicImpact(symbol, indicators);
            
            return {
                direction: impact.direction,
                confidence: impact.confidence,
                economic_factors: indicators,
                target_price: null,
                risk_level: impact.risk_level
            };
        } catch (error) {
            console.error('Economic analysis error:', error);
            return null;
        }
    }

    async getEconomicIndicators() {
        return {
            inflation_rate: 4.2 + (Math.random() - 0.5) * 0.5,
            interest_rate: 11.75,
            gdp_growth: 2.8 + (Math.random() - 0.5) * 0.8,
            unemployment: 7.9 + (Math.random() - 0.5) * 0.6,
            currency_strength: (Math.random() - 0.5) * 0.4,
            commodity_prices: (Math.random() - 0.5) * 0.3
        };
    }

    calculateEconomicImpact(symbol, indicators) {
        let direction = 0;
        let confidence = 0.6;
        let risk = 0.4;
        
        // Sector-specific impacts
        if (symbol.includes('PETR')) {
            // Oil company - benefits from higher commodity prices
            direction += indicators.commodity_prices;
            confidence += 0.1;
        } else if (symbol.includes('ITUB')) {
            // Bank - benefits from higher interest rates
            direction += (indicators.interest_rate - 10) * 0.1;
            confidence += 0.1;
        }
        
        // General economic health
        if (indicators.gdp_growth > 3) {
            direction += 0.1;
        } else if (indicators.gdp_growth < 1) {
            direction -= 0.1;
            risk += 0.1;
        }
        
        // Inflation impact
        if (indicators.inflation_rate > 5) {
            direction -= 0.05;
            risk += 0.1;
        }
        
        return {
            direction: Math.max(-1, Math.min(1, direction)),
            confidence: Math.min(0.85, confidence),
            risk_level: Math.min(0.9, risk)
        };
    }
}

// Machine Learning Model (Simplified)
class MachineLearningModel {
    constructor() {
        this.features = ['price_momentum', 'volume_trend', 'volatility', 'market_correlation'];
        this.weights = [0.3, 0.2, 0.25, 0.25];
    }

    async predict(symbol, timeframe) {
        try {
            const features = await this.extractFeatures(symbol);
            const prediction = this.runModel(features);
            
            return {
                direction: prediction.direction,
                confidence: prediction.confidence,
                features,
                target_price: prediction.target_price,
                risk_level: prediction.risk_level
            };
        } catch (error) {
            console.error('ML model error:', error);
            return null;
        }
    }

    async extractFeatures(symbol) {
        // Simulate feature extraction
        return {
            price_momentum: (Math.random() - 0.5) * 2,
            volume_trend: (Math.random() - 0.5) * 1.5,
            volatility: Math.random() * 0.8 + 0.1,
            market_correlation: Math.random() * 0.9 + 0.1
        };
    }

    runModel(features) {
        // Simplified neural network simulation
        let output = 0;
        
        this.features.forEach((feature, index) => {
            output += features[feature] * this.weights[index];
        });
        
        // Apply activation function (tanh)
        const direction = Math.tanh(output);
        
        // Calculate confidence based on feature strength
        const featureStrength = Object.values(features)
            .reduce((sum, val) => sum + Math.abs(val), 0) / this.features.length;
        
        const confidence = Math.min(0.9, 0.4 + featureStrength * 0.3);
        
        // Calculate target price (simplified)
        const currentPrice = 100; // Placeholder
        const targetPrice = currentPrice * (1 + direction * 0.1);
        
        return {
            direction,
            confidence,
            target_price: targetPrice,
            risk_level: 1 - confidence
        };
    }
}

// Export for use in main app
window.MarketPredictionsEngine = MarketPredictionsEngine;