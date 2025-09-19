import React from 'react';
import Header from '../components/Header';

const PortfolioPage: React.FC = () => {
    return (
        <div>
            <Header />
            <main style={{ padding: 'var(--space-24)' }}>
                <h1>Portfolio</h1>
                <p>This page will show a detailed view of the portfolio.</p>
            </main>
        </div>
    );
};

export default PortfolioPage;
