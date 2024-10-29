import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeviceDetails from '../DeviceDetails/DeviceDetails';
import DeviceCreate from '../DeviceCreate/DeviceCreate';
import CalendarSettings from '../../../calendarManagement/components/CalendarSettings/CalendarSettings';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useAuth } from '../../../../contexts/AuthContext';

export default function Device() {
    const { user } = useAuth();
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openSettingsModal = () => setIsSettingsModalOpen(true);
    const closeSettingsModal = () => setIsSettingsModalOpen(false);

    const [filters, setFilters] = useState({
        clientName: "",
        deviceName: "",
        deviceStatus: ""
    });

    const [filteredDevices, setFilteredDevices] = useState([]);

    useEffect(() => {
        fetchDevices();
    }, []);

    useEffect(() => {
        filterDevices();
    }, [devices, filters]);

    const fetchDevices = async () => {
        try {
            const response = await axios.get('/devices/');
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const handleDeleteDevice = async (id) => {
        try {
            await axios.delete(`/devices/${id}/`);
            fetchDevices();
            toast.success('Dispositivo eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting device:', error);
            if (error.response && error.response.status === 403) {
                toast.error('No tienes permiso para eliminar este dispositivo.');
            } else {
                toast.error('Error al eliminar dispositivo');
            }
        }
    };

    const filterDevices = () => {
        let tempDevices = devices.filter(device =>
            device.client_name.toLowerCase().includes(filters.clientName.toLowerCase()) &&
            device.name.toLowerCase().includes(filters.deviceName.toLowerCase()) &&
            device.device_status.toLowerCase().includes(filters.deviceStatus.toLowerCase())
        );
        setFilteredDevices(tempDevices);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const openDetailsModal = (device) => {
        setSelectedDevice(device);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className="home p-5">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">Reparaciones</h2>
            <div className="mb-5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-700">FILTROS</span>
                <input
                    type="text"
                    name="clientName"
                    placeholder="Buscar por nombre del cliente..."
                    value={filters.clientName}
                    onChange={handleFilterChange}
                    className="flex-grow p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="deviceName"
                    placeholder="Buscar por nombre del dispositivo..."
                    value={filters.deviceName}
                    onChange={handleFilterChange}
                    className="flex-grow p-2 border border-gray-300 rounded"
                />
                <select
                    name="deviceStatus"
                    value={filters.deviceStatus}
                    onChange={handleFilterChange}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">Todos los estados</option>
                    <option value="en_reparacion">En reparación</option>
                    <option value="reparado">Reparado</option>
                    <option value="entregado">Entregado</option>
                </select>
            </div>
            <div className="mb-5 flex justify-center gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={openModal}>Crear Reparación</button>
                {user?.is_staff && (
                    <button
                        onClick={openSettingsModal}
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800"
                    >
                        Opciones
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-5 justify-center">
                {filteredDevices.map(device => (
                    <div key={device.id} className="bg-white rounded shadow-md w-full max-w-sm p-5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-2">{device.name}</h3>
                            <p className="mb-2"><strong>Cliente:</strong> {device.client_name}</p>
                            <p className="mb-2" ><strong>Descripción:</strong> {device.description}</p>
                            <p className="mb-2"><strong>Estado del dispositivo:</strong> {device.device_status_display}</p>
                            <p className="mb-2" ><strong>Fecha de inicio:</strong> {formatDate(device.start_date)}</p>
                            <p className="mb-2" ><strong>Fecha de finalización:</strong> {formatDate(device.finished_date)}</p>
                            <p className="mb-2" ><strong>Codigo:</strong> {device.unique_code}</p>
                            <p className="mb-2">
                                <strong>Enlace de estado de reparación:</strong>{' '}
                                <Link to={`/device-status?code=${device.unique_code}`} className="text-blue-500 hover:underline">
                                    Estado del dispositivo
                                </Link>
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <button onClick={() => openDetailsModal(device)} className="text-xl text-black-600 hover:text-blue-600">
                                <i className='bx bxs-edit-alt'></i>
                            </button>
                            <button onClick={() => handleDeleteDevice(device.id)} className="text-xl text-black-600 hover:text-red-600">
                                <i className='bx bxs-trash-alt'></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <DeviceDetails
                isOpen={isDetailsModalOpen}
                closeModal={closeDetailsModal}
                device={selectedDevice}
                refreshDevices={fetchDevices}
            />
            <DeviceCreate
                isOpen={isModalOpen}
                closeModal={closeModal}
                refreshDevices={fetchDevices}
            />
            <CalendarSettings
                isOpen={isSettingsModalOpen}
                closeModal={closeSettingsModal}
            />
        </div>
    );
}
