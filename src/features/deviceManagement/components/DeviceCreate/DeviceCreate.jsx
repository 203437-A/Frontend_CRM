import React, { useState, useEffect } from 'react';  
import axios from 'axios';
import Modal from '../../../../components/common/Modal/Modal'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeviceCreate = ({ isOpen, closeModal, refreshDevices }) => {
    const [formData, setFormData] = useState({
        client: '',
        name: '',
        description: '',
        device_status: 'en_reparacion',
        start_date: '',
        finished_date: ''
    });
    const [clients, setClients] = useState([]);
    const [settings, setSettings] = useState({
        allow_weekends: false,
        start_hour: "08:00",
        end_hour: "16:00"
    });
    const [occupiedDates, setOccupiedDates] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchClients();
            fetchSettings();
            fetchOccupiedDates();
        }
    }, [isOpen]);

    const fetchClients = async () => {
        try {
            const response = await axios.get('/clients/');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Error al cargar la lista de clientes');
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/calendar-settings/');
            setSettings(response.data);
        } catch (error) {
            console.error('Error fetching calendar settings:', error);
            toast.error('Error al cargar las configuraciones del calendario');
        }
    };

    const fetchOccupiedDates = async () => {
        try {
            const response = await axios.get('/occupied-dates/');
            setOccupiedDates(response.data);
        } catch (error) {
            console.error('Error fetching occupied dates:', error);
            toast.error('Error al cargar las fechas ocupadas');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formattedFormData = {
            ...formData,
            start_date: formData.start_date ? new Date(formData.start_date).toISOString() : '',
            finished_date: formData.finished_date ? new Date(formData.finished_date).toISOString() : ''
        };

        try {
            await axios.post('/devices/', formattedFormData);
            refreshDevices();
            toast.success('Dispositivo creado exitosamente');
            closeModal();
            setFormData({
                client: '',
                name: '',
                description: '',
                device_status: 'en_reparacion',
                start_date: '',
                finished_date: ''
            });
        } catch (error) {
            console.error('Error creating device:', error);
            toast.error('Error al crear dispositivo');
            if (error.response && error.response.data) {
                const errors = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value.join(' ')}`).join('\n');
                toast.error(`Error al crear dispositivo: ${errors}`);
            }
        }
    };

    const validateDate = (date) => {
        const selectedDate = new Date(date);
        const day = selectedDate.getDay();
        const hour = selectedDate.getHours();

        if (!settings.allow_weekends && (day === 0 || day === 6)) {
            toast.error('No se permite seleccionar fines de semana.');
            return false;
        }

        const startHour = parseInt(settings.start_hour.split(':')[0], 10);
        const endHour = parseInt(settings.end_hour.split(':')[0], 10);
        if (hour < startHour || hour >= endHour) {
            toast.error('Por favor, selecciona una hora dentro del horario laboral.');
            return false;
        }

        const dateStr = selectedDate.toISOString().split('T')[0];
        if (occupiedDates.includes(dateStr)) {
            toast.error('La fecha seleccionada ya está ocupada.');
            return false;
        }

        return true;
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (validateDate(value)) {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Crear dispositivo/reparación</h2>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Nombre del cliente</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.first_name} {client.last_name}</option>
                            ))}
                        </select>
                    </div>
    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Dispositivo</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Estado del dispositivo</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="device_status"
                            value={formData.device_status}
                            onChange={handleChange}
                            required
                        >
                            <option value="en_reparacion">En reparación</option>
                            <option value="reparado">Reparado</option>
                            <option value="entregado">Entregado</option>
                        </select>
                    </div>
    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Fecha de inicio</label>
                        <input
                            type="datetime-local"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleDateChange}
                            required
                        />
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Fecha de finalización</label>
                        <input
                            type="datetime-local"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="finished_date"
                            value={formData.finished_date}
                            onChange={handleDateChange}
                            required
                        />
                    </div>
    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Descripción</label>
                        <textarea
                            className="mt-1 p-2 border border-gray-300 rounded h-20 resize-none"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
    
                    <div className="col-span-2 flex justify-between mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            Crear 
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default DeviceCreate;
