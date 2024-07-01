import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';  
import logo from '../../../assets/logo.png';
import { useAuth } from '../../../contexts/AuthContext'; 

const Sidebar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();  

    const handleLogout = (event) => {
        event.preventDefault();  
        logout();  
        navigate('/login/');  
    };

    return (
        <div>
            <nav className="sidebar">
                <header>
                    <div className="image-text">
                        <span className="image">
                            <img src={logo} alt="logo" />
                        </span>
                        <div className="text logo-text">
                            <span className="name">CRM</span>
                            <span className="mini">Soporte</span>
                        </div>
                    </div>
                </header>
                <div className="menu-bar">
                    <div className="menu">
                        <ul className="menu-links">
                            <li className="nav-link">
                                <a href="#">
                                    <i className='bx bxs-home icon'></i>
                                    <span className="text nav-text">Home</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="/profile">
                                    <i className='bx bxs-user icon'></i>
                                    <span className="text nav-text">Perfil</span>
                                </a>
                            </li>
                            {user && user.is_staff && (
                                <li className="nav-link">
                                    <a href="/employee">
                                        <i className='bx bxs-user-detail icon'></i>
                                        <span className="text nav-text">Empleados</span>
                                    </a>
                                </li>
                            )}
                            <li className="nav-link">
                                <a href="/client">
                                    <i className='bx bxs-user-pin icon' ></i>
                                    <span className="text nav-text">Clientes</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="/device">
                                    <i className='bx bxs-devices icon' ></i>
                                    <span className="text nav-text">Reparaciones</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="/project">
                                    <i className='bx bxs-folder-minus icon'></i>
                                    <span className="text nav-text">Proyectos</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="/service-pages">
                                    <i className='bx bxs-book-alt icon'></i>
                                    <span className="text nav-text">Hojas de servicios</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="/calendar">
                                    <i className='bx bxs-calendar-alt icon'></i>
                                    <span className="text nav-text">Calendario</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="bottom-content">
                        <li>
                            <a href="" onClick={handleLogout}>
                                <i className='bx bx-log-out icon'></i>
                                <span className="text nav-text">Logout</span>
                            </a>
                        </li>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
