import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
    const linkStyle: React.CSSProperties = {
        marginRight: 'var(--space-16)',
        color: 'var(--color-text)',
        textDecoration: 'none',
        fontWeight: 'var(--font-weight-medium)',
        paddingBottom: 'var(--space-4)',
    };

    const activeLinkStyle: React.CSSProperties = {
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-primary)',
        borderBottom: '2px solid var(--color-primary)',
    };

    return (
        <header className="nav-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'var(--font-weight-semibold)' }}>AI Economic Advisor</h1>
                <nav>
                    <NavLink 
                        to="/dashboard" 
                        style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink 
                        to="/portfolio" 
                        style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}
                    >
                        Portfolio
                    </NavLink>
                    <NavLink 
                        to="/ai-chat" 
                        style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}
                    >
                        AI Chat
                    </NavLink>
                    <NavLink 
                        to="/settings" 
                        style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}
                    >
                        Settings
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Header;