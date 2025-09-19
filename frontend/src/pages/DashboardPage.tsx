import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import PerformanceChart from '../components/PerformanceChart';
import PortfolioTable from '../components/PortfolioTable';
import {
    getPortfolioMetrics,
    getEconomicIndicators,
    getAIInsights,
    PortfolioMetrics,
    EconomicIndicators,
    AIInsight
} from '../services/dataService';

// Helper component for the main metric cards
const MetricCard: React.FC<{ title: string; value: string | number; suffix?: string; valueColor?: string; }> = ({ title, value, suffix, valueColor }) => (
    <div>
        <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-4)' }}>{title}</h3>
        <p style={{ fontSize: '1.75rem', fontWeight: 'var(--font-weight-semibold)', color: valueColor, margin: 0 }}>
            {value}{suffix}
        </p>
    </div>
);


const DashboardPage: React.FC = () => {
    const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
    const [indicators, setIndicators] = useState<EconomicIndicators | null>(null);
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [metricsData, indicatorsData, insightsData] = await Promise.all([
                    getPortfolioMetrics(),
                    getEconomicIndicators(),
                    getAIInsights()
                ]);
                setMetrics(metricsData);
                setIndicators(indicatorsData);
                setInsights(insightsData);
            } catch (err) {
                setError('Failed to load dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <p style={{ textAlign: 'center', padding: 'var(--space-24)' }}>Loading dashboard...</p>;
        }
        if (error || !metrics || !indicators) {
            return <p style={{ textAlign: 'center', padding: 'var(--space-24)', color: 'var(--color-error)' }}>{error || 'No data available.'}</p>;
        }

        return (
            <div style={{ display: 'grid', gap: 'var(--space-24)', gridTemplateColumns: 'repeat(12, 1fr)' }}>
                
                <div className="card" style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-16)' }}>
                    <MetricCard title="Portfolio Value" value={metrics.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                    <MetricCard title="Return" value={metrics.returnPercent.toFixed(2)} suffix="%" valueColor={metrics.returnPercent >= 0 ? '#4caf50' : '#f44336'} />
                    <MetricCard title="Sharpe Ratio" value={metrics.sharpeRatio} />
                    <MetricCard title="Beta" value={metrics.beta} />
                    <MetricCard title="VaR (95%)" value={`${metrics.var95}%`} />
                </div>

                <div className="card" style={{ gridColumn: 'span 12', display: 'grid', gap: 'var(--space-24)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    <div>
                        <h4>Key Economic Indicators</h4>
                        <p>Brazil Inflation: {indicators.brazilInflation.value}%</p>
                        <p>Selic Rate: {indicators.selicRate.value}%</p>
                        <p>USD/BRL: {indicators.usdBrl.value}</p>
                    </div>
                    <div>
                        <h4>AI Market Insights</h4>
                        <ul style={{paddingLeft: 'var(--space-16)', margin: 0, color: 'var(--color-text-secondary)'}}>
                            {insights.map((insight, index) => <li key={index}>{insight}</li>)}
                        </ul>
                    </div>
                </div>
                
                <div className="card" style={{ gridColumn: 'span 12' }}>
                    <PerformanceChart />
                </div>
                <div className="card" style={{ gridColumn: 'span 12' }}>
                    <PortfolioTable holdings={metrics.holdings} />
                </div>
            </div>
        );
    };

    return (
        <div>
            <Header />
            <main style={{ padding: 'var(--space-24)' }}>
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardPage;
