// Demo Features for AI Economic Advisor
class DemoFeatures {
    constructor() {
        this.isDemo = true;
        this.demoData = {
            marketUpdates: [],
            predictions: [],
            notifications: []
        };
        this.init();
    }

    init() {
        this.createDemoPanel();
        this.startDemoSequence();
    }

    createDemoPanel() {
        const panel = document.createElement('div');
        panel.className = 'demo-panel';
        panel.innerHTML = `
            <div class="demo-header">
                <h3>🎯 Demo Features</h3>
                <button class="demo-close" id="demoClose">×</button>
            </div>
            <div class="demo-content">
                <div class="demo-section">
                    <h4>📊 Real-time Features</h4>
                    <button class="demo-btn" id="simulateMarketUpdate">Simulate Market Update</button>
                    <button class="demo-btn" id="triggerPrediction">Generate AI Prediction</button>
                    <button class="demo-btn" id="showNotification">Show Market Alert</button>
                </div>
                <div class="demo-section">
                    <h4>🤖 AI Features</h4>
                    <button class="demo-btn" id="runOptimization">Run Portfolio Optimization</button>
                    <button class="demo-btn" id="generateInsights">Generate Market Insights</button>
                    <button class="demo-btn" id="riskAnalysis">Perform Risk Analysis</button>
                </div>
                <div class="demo-section">
                    <h4>📈 Interactive Charts</h4>
                    <button class="demo-btn" id="animateCharts">Animate All Charts</button>
                    <button class="demo-btn" id="updatePortfolio">Update Portfolio Data</button>
                    <button class="demo-btn" id="switchTheme">Toggle Theme</button>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .demo-panel {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 300px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                opacity: 0.9;
                transition: all 0.3s ease;
            }

            .demo-panel:hover {
                opacity: 1;
            }

            .demo-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: var(--color-primary);
                color: var(--color-btn-primary-text);
                border-radius: var(--radius-lg) var(--radius-lg) 0 0;
            }

            .demo-header h3 {
                margin: 0;
                font-size: 14px;
            }

            .demo-close {
                background: none;
                border: none;
                color: var(--color-btn-primary-text);
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .demo-content {
                padding: 16px;
                max-height: 400px;
                overflow-y: auto;
            }

            .demo-section {
                margin-bottom: 16px;
            }

            .demo-section h4 {
                margin: 0 0 8px 0;
                font-size: 12px;
                color: var(--color-text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .demo-btn {
                display: block;
                width: 100%;
                padding: 8px 12px;
                margin-bottom: 6px;
                background: var(--color-secondary);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-base);
                color: var(--color-text);
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .demo-btn:hover {
                background: var(--color-secondary-hover);
                transform: translateY(-1px);
            }

            .demo-btn:active {
                transform: translateY(0);
            }

            .demo-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: var(--color-success);
                color: white;
                padding: 12px 16px;
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-lg);
                z-index: 1001;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .demo-hidden {
                display: none;
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(panel);

        this.setupDemoEventListeners();
    }

    setupDemoEventListeners() {
        // Close demo panel
        document.getElementById('demoClose')?.addEventListener('click', () => {
            document.querySelector('.demo-panel').classList.add('demo-hidden');
        });

        // Demo buttons
        document.getElementById('simulateMarketUpdate')?.addEventListener('click', () => {
            this.simulateMarketUpdate();
        });

        document.getElementById('triggerPrediction')?.addEventListener('click', () => {
            this.triggerPrediction();
        });

        document.getElementById('showNotification')?.addEventListener('click', () => {
            this.showNotification();
        });

        document.getElementById('runOptimization')?.addEventListener('click', () => {
            this.runOptimization();
        });

        document.getElementById('generateInsights')?.addEventListener('click', () => {
            this.generateInsights();
        });

        document.getElementById('riskAnalysis')?.addEventListener('click', () => {
            this.riskAnalysis();
        });

        document.getElementById('animateCharts')?.addEventListener('click', () => {
            this.animateCharts();
        });

        document.getElementById('updatePortfolio')?.addEventListener('click', () => {
            this.updatePortfolio();
        });

        document.getElementById('switchTheme')?.addEventListener('click', () => {
            this.switchTheme();
        });
    }

    simulateMarketUpdate() {
        console.log('🔄 Simulating market update...');
        
        // Update economic indicators with animation
        const indicators = document.querySelectorAll('.indicator-value');
        indicators.forEach(indicator => {
            indicator.style.transform = 'scale(1.1)';
            indicator.style.color = 'var(--color-primary)';
            
            setTimeout(() => {
                indicator.style.transform = 'scale(1)';
                indicator.style.color = '';
            }, 300);
        });

        this.showDemoNotification('📊 Market data updated successfully!');
    }

    triggerPrediction() {
        console.log('🤖 Generating AI prediction...');
        
        const predictions = [
            '📈 PETR4 showing bullish signals - 85% confidence',
            '⚠️ ITUB3 may face resistance at current levels',
            '🎯 Market volatility expected to decrease next week',
            '💡 Energy sector outperforming broader market'
        ];

        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        this.showDemoNotification(randomPrediction, 4000);
    }

    showNotification() {
        const notifications = [
            '🚨 Portfolio value increased by 2.3% today',
            '📢 Federal Reserve meeting scheduled for tomorrow',
            '💰 ITUB3 dividend payment processed',
            '⚡ High volatility detected in energy sector'
        ];

        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        this.showDemoNotification(randomNotification);
    }

    runOptimization() {
        console.log('⚡ Running portfolio optimization...');
        
        // Show loading effect
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(0.98)';
                card.style.boxShadow = '0 0 20px rgba(31, 184, 205, 0.3)';
                
                setTimeout(() => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }, 200);
            }, index * 100);
        });

        setTimeout(() => {
            this.showDemoNotification('✅ Portfolio optimization complete! Check AI Chat for details.');
        }, 1000);
    }

    generateInsights() {
        console.log('💡 Generating market insights...');
        
        // Animate AI insights section
        const insightsCard = document.querySelector('.ai-insights');
        if (insightsCard) {
            insightsCard.style.background = 'linear-gradient(135deg, var(--color-bg-3), var(--color-bg-1))';
            
            setTimeout(() => {
                insightsCard.style.background = '';
            }, 1000);
        }

        this.showDemoNotification('🧠 New AI insights generated based on latest market data!');
    }

    riskAnalysis() {
        console.log('🎯 Performing risk analysis...');
        
        // Animate risk metrics
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach((metric, index) => {
            setTimeout(() => {
                metric.style.color = 'var(--color-warning)';
                metric.style.fontWeight = 'bold';
                
                setTimeout(() => {
                    metric.style.color = '';
                    metric.style.fontWeight = '';
                }, 500);
            }, index * 200);
        });

        this.showDemoNotification('📊 Risk analysis complete - VaR updated to 2.1%');
    }

    animateCharts() {
        console.log('📈 Animating charts...');
        
        // Trigger chart animations if available
        if (window.economicAdvisor && window.economicAdvisor.charts) {
            Object.values(window.economicAdvisor.charts).forEach(chart => {
                if (chart && chart.update) {
                    chart.update('active');
                }
            });
        }

        // Animate chart containers
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach((container, index) => {
            setTimeout(() => {
                container.style.transform = 'rotateY(5deg)';
                container.style.transition = 'transform 0.5s ease';
                
                setTimeout(() => {
                    container.style.transform = '';
                }, 500);
            }, index * 200);
        });

        this.showDemoNotification('📊 All charts updated with latest data!');
    }

    updatePortfolio() {
        console.log('💼 Updating portfolio data...');
        
        // Animate portfolio value
        const portfolioValue = document.getElementById('portfolioValue');
        if (portfolioValue) {
            const currentValue = parseFloat(portfolioValue.textContent.replace(/[^0-9.]/g, ''));
            const newValue = currentValue * (1 + (Math.random() - 0.5) * 0.02);
            
            portfolioValue.style.color = 'var(--color-success)';
            portfolioValue.textContent = newValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            setTimeout(() => {
                portfolioValue.style.color = '';
            }, 1000);
        }

        this.showDemoNotification('💰 Portfolio values updated with real-time data!');
    }

    switchTheme() {
        console.log('🎨 Switching theme...');
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.click();
        }

        this.showDemoNotification('🌓 Theme switched successfully!');
    }

    showDemoNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'demo-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    startDemoSequence() {
        // Auto-demo sequence (optional)
        setTimeout(() => {
            console.log('🎬 Demo sequence ready. Use the demo panel to test features!');
        }, 2000);
    }
}

// Initialize demo features
document.addEventListener('DOMContentLoaded', () => {
    // Only show demo in development or when explicitly requested
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true' || window.location.hostname === 'localhost') {
        window.demoFeatures = new DemoFeatures();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DemoFeatures;
}