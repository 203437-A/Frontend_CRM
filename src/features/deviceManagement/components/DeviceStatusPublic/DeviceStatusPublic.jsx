// DeviceStatusSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeviceStatus = () => {
    const [code, setCode] = useState('');
    const [device, setDevice] = useState(null);

    const handleSearch = async () => {
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
            <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">Buscar Estado del Dispositivo</h2>
            <div className="flex justify-center mb-5">
                <input
                    type="text"
                    placeholder="Ingrese el código de su dispositivo..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={handleSearch}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Buscar
                </button>
            </div>
            {device && (
                <div className="bg-white rounded shadow-md p-5 max-w-md mx-auto">
                    <h3 className="text-lg font-bold mb-2">{device.name}</h3>
                    <p className="mb-2"><strong>Descripción:</strong> {device.description}</p>
                    <p className="mb-2"><strong>Estado:</strong> {device.device_status_display}</p>
                </div>
            )}
        </div>
    );
};

export default DeviceStatus;

