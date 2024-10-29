import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshAuthToken } from '../config/auth'; 

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return {
            token: localStorage.getItem('token'),
            refresh: localStorage.getItem('refresh'),
            user_id: localStorage.getItem('user_id'),
            username: localStorage.getItem('username'),
            first_name: localStorage.getItem('first_name'),
            last_name: localStorage.getItem('last_name'),
            email: localStorage.getItem('email'),
            phone_number: localStorage.getItem('phone_number'),
            is_staff: localStorage.getItem('is_staff') === 'true',  
        };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Refrescar token...");
            refreshAuthToken();
        }, 60 * 60 * 1000); 

        return () => clearInterval(interval);
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.access);
        localStorage.setItem('refresh', userData.refresh);
        localStorage.setItem('user_id', userData.user_id);
        localStorage.setItem('is_staff', userData.is_staff);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('first_name', userData.first_name);
        localStorage.setItem('last_name', userData.last_name);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('phone_number', userData.phone_number);
        setUser({
            token: userData.access,
            refresh: userData.refresh,
            ...userData
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user_id');
        localStorage.removeItem('is_staff');
        localStorage.removeItem('username');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        localStorage.removeItem('email');
        localStorage.removeItem('phone_number');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};
