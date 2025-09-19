import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // If authenticated, render the child components (the dashboard).
    // Otherwise, redirect to the login page.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
