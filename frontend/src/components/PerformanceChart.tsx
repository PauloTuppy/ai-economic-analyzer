import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPerformanceData, PerformanceData } from '../services/dataService';

const PerformanceChart: React.FC = () => {
    const [data, setData] = useState<PerformanceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPerformanceData().then(response => {
            setData(response);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to load performance data", err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Chart...</div>;
    }

    return (
        <div>
            <h3 style={{ marginBottom: 'var(--space-16)' }}>Performance History</h3>
            <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
                        <YAxis stroke="var(--color-text-secondary)" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'var(--color-surface)', 
                                border: '1px solid var(--color-border)' 
                            }} 
                        />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceChart;