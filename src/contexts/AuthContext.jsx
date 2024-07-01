import React, { createContext, useContext, useState, useEffect } from 'react';

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

    const login = (userData) => {

        localStorage.setItem('token', userData.access);
        localStorage.setItem('user_id', userData.user_id);
        localStorage.setItem('is_staff', userData.is_staff);
        setUser({
            token: userData.access,
            ...userData
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('is_staff');
        localStorage.removeItem('id');
        localStorage.removeItem('last_name');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('phone_number');
        localStorage.removeItem('first_name');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
