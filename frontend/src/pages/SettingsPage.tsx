import React from 'react';
import Header from '../components/Header';

const SettingsPage: React.FC = () => {
    return (
        <div>
            <Header />
            <main style={{ padding: 'var(--space-24)' }}>
                <h1>Settings</h1>
                <p>This page will contain application settings.</p>
            </main>
        </div>
    );
};

export default SettingsPage;
