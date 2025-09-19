import React from 'react';
import { Holding } from '../services/dataService';

interface PortfolioTableProps {
    holdings: Holding[];
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ holdings }) => {
    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
    };
    const thStyle: React.CSSProperties = {
        textAlign: 'left',
        padding: 'var(--space-8) var(--space-12)',
        borderBottom: '1px solid var(--color-border)',
        color: 'var(--color-text-secondary)',
        fontWeight: 'var(--font-weight-medium)',
        fontSize: '0.875rem',
    };
    const tdStyle: React.CSSProperties = {
        padding: 'var(--space-12)',
        borderBottom: '1px solid var(--color-border)',
    };

    return (
        <div>
            <h3 style={{ marginBottom: 'var(--space-16)' }}>Portfolio Holdings</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Asset</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {holdings.map((row) => (
                        <tr key={row.symbol}>
                            <td style={tdStyle}>{row.name}</td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                {row.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioTable;
