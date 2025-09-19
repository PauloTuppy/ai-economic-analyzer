import React from 'react';
import Header from '../components/Header';

const ChatPage: React.FC = () => {
    return (
        <div>
            <Header />
            <main style={{ padding: 'var(--space-24)' }}>
                <h1>AI Chat</h1>
                <p>This page will contain the AI chat interface.</p>
            </main>
        </div>
    );
};

export default ChatPage;
