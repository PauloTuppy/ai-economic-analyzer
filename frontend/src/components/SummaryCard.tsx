import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface SummaryCardProps {
    title: string;
    value: string | number;
    prefix?: string;
    suffix?: string;
    color?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, prefix = '', suffix = '', color = 'text.primary' }) => {
    return (
        <Paper 
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: 140,
            }}
        >
            <Typography variant="subtitle1" color="text.secondary">
                {title}
            </Typography>
            <Typography component="p" variant="h4" color={color}>
                {prefix}{value}{suffix}
            </Typography>
        </Paper>
    );
};

export default SummaryCard;
