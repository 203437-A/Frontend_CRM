import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ requireStaff = false }) => {
    const { user } = useAuth();

    if (!user || !user.token) {
        return <Navigate to="/login" replace />;
    }

    if (requireStaff && !user.is_staff) { 
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
