import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './device.module.css'; 
import DeviceDetails from '../DeviceDetails/DeviceDetails'; 
import DeviceCreate from '../DeviceCreate/DeviceCreate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function Device() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
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
            console.log(response);
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
        <div className='home'>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className='title-container'>Reparaciones</h2>
            <div className={styles.filterContainer}>
                <span>FILTROS</span>
                <input 
                    type="text" 
                    name="clientName" 
                    placeholder="Buscar por nombre del cliente..." 
                    value={filters.clientName} 
                    onChange={handleFilterChange} 
                />
                <input 
                    type="text" 
                    name="deviceName" 
                    placeholder="Buscar por nombre del dispositivo..." 
                    value={filters.deviceName} 
                    onChange={handleFilterChange} 
                />
                <select 
                    name="deviceStatus" 
                    value={filters.deviceStatus} 
                    onChange={handleFilterChange}
                >
                    <option value="">Todos los estados</option>
                    <option value="en_reparacion">En reparacion</option>
                    <option value="reparado">Reparado</option>
                    <option value="entregado">Entregado</option>
                </select>
            </div>
            <table className={styles.styledTable}>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Dispositivo</th>
                        <th>Descripción</th>
                        <th>Estado del dispositivo</th>
                        <th>Fecha de inicio</th>
                        <th>Fecha de finalización</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDevices.map(device => (
                        <tr key={device.id}>
                            <td>{device.client_name}</td>
                            <td>{device.name}</td>
                            <td data-tooltip-id="device-tooltip" data-tooltip-content={device.description}>{device.description}</td>
                            <td>{device.device_status_display}</td>
                            <td data-tooltip-id="device-tooltip" data-tooltip-content={formatDate(device.start_date)}>{formatDate(device.start_date)}</td>
                            <td data-tooltip-id="device-tooltip" data-tooltip-content={formatDate(device.finished_date)}>{formatDate(device.finished_date)}</td>
                            <td>
                                <button onClick={() => openDetailsModal(device)} className={styles.iconBtn}>
                                    <i className='bx bxs-edit-alt edit'></i>
                                </button>
                                <button onClick={() => handleDeleteDevice(device.id)} className={styles.iconBtn}>
                                    <i className='bx bxs-trash-alt delete' ></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactTooltip id="device-tooltip" multiline={true} effect="solid"/>
            <DeviceDetails
                isOpen={isDetailsModalOpen}
                closeModal={closeDetailsModal}
                device={selectedDevice}
                refreshDevices={fetchDevices}
            />
            <button className={styles.createButton} onClick={openModal}>Crear Reparación</button>
            <DeviceCreate
                isOpen={isModalOpen}
                closeModal={closeModal}
                refreshDevices={fetchDevices}
            />
        </div>
      );
}
