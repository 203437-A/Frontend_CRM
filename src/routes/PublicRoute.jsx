import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = () => {
    const { user } = useAuth();

    if (user && user.token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
