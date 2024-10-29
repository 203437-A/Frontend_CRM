import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

const DeviceStatus = () => {
    const [device, setDevice] = useState(null);
    const location = useLocation();
    
    const getCodeFromUrl = () => {
        const params = new URLSearchParams(location.search);
        return params.get('code') || '';
    };

    useEffect(() => {
        const code = getCodeFromUrl();
        if (code) {
            handleSearch(code);
        }
    }, [location]);

    const handleSearch = async (code) => {
        try {
            const response = await axios.get(`/device-status/`, { params: { code } });
            setDevice(response.data);
        } catch (error) {
            console.error('Error fetching device status:', error);
            toast.error('Error al obtener el estado del dispositivo');
        }
    };

    return (
        <div className="p-5">
            <ToastContainer position="bottom-right" autoClose={5000} />
            <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">
                Estado del Dispositivo
            </h2>
            {device ? (
                <div className="bg-white rounded shadow-md p-5 max-w-md mx-auto">
                    <h3 className="text-lg font-bold mb-2">{device.name}</h3>
                    <p className="mb-2"><strong>Descripción:</strong> {device.description}</p>
                    <p className="mb-2"><strong>Estado:</strong> {device.device_status_display}</p>
                </div>
            ) : (
                <p className="text-center text-red-500">No se encontró el dispositivo.</p>
            )}
        </div>
    );
};

export default DeviceStatus;