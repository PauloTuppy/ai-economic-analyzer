const API_BASE_URL = 'http://127.0.0.1:5000/api';

// --- Interfaces ---

export interface PerformanceData {
    name: string;
    value: number;
}

export interface Holding {
    symbol: string;
    name: string;
    value: number;
}

export interface PortfolioMetrics {
    totalValue: number;
    returnPercent: number;
    holdings: Holding[];
    sharpeRatio: number;
    beta: number;
    var95: number;
}

export interface EconomicIndicators {
    brazilInflation: { value: number; change: number };
    selicRate: { value: number };
    usdBrl: { value: number; change: number };
    oilPrice: { value: number; change: number };
}

export type AIInsight = string;


// --- API Fetch Functions ---

export const getPerformanceData = async (): Promise<PerformanceData[]> => {
    const response = await fetch(`${API_BASE_URL}/performance`);
    if (!response.ok) throw new Error('Failed to fetch performance data');
    return response.json();
};

export const getPortfolioMetrics = async (): Promise<PortfolioMetrics> => {
    const response = await fetch(`${API_BASE_URL}/portfolio/metrics`);
    if (!response.ok) throw new Error('Failed to fetch portfolio metrics');
    return response.json();
};

export const getEconomicIndicators = async (): Promise<EconomicIndicators> => {
    const response = await fetch(`${API_BASE_URL}/economic-indicators`);
    if (!response.ok) throw new Error('Failed to fetch economic indicators');
    return response.json();
};

export const getAIInsights = async (): Promise<AIInsight[]> => {
    const response = await fetch(`${API_BASE_URL}/ai-insights`);
    if (!response.ok) throw new Error('Failed to fetch AI insights');
    return response.json();
};
