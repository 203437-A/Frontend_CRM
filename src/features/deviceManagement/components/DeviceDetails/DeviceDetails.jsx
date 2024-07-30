import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../../../../components/common/Modal/Modal'; 
import 'react-toastify/dist/ReactToastify.css';

const DeviceDetails = ({ isOpen, closeModal, device, refreshDevices }) => {
    const [details, setDetails] = useState({
        client: '',
        name: '',
        description: '',
        device_status: '',
        start_date: '',
        finished_date: '',
        unique_code: '', // Añadido
    });
    const [settings, setSettings] = useState({
        allow_weekends: false,
        start_hour: "08:00",
        end_hour: "16:00"
    });
    const [occupiedDates, setOccupiedDates] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchSettings();
            fetchOccupiedDates();
        }
    }, [isOpen]);

    useEffect(() => {
        if (device) {
            setDetails({
                client: device.client || '',
                name: device.name || '',
                description: device.description || '',
                device_status: device.device_status || '',
                start_date: device.start_date ? formatToLocalDateTime(device.start_date) : '',
                finished_date: device.finished_date ? formatToLocalDateTime(device.finished_date) : '',
                unique_code: device.unique_code || '', // Añadido
            });
        }
    }, [device]);

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

    const formatToLocalDateTime = (date) => {
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
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
            setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
        } else {
            setDetails(prevDetails => ({ ...prevDetails, [name]: '' })); // Clear the input if validation fails
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedDetails = {
            ...details,
            start_date: details.start_date ? new Date(details.start_date).toISOString() : '',
            finished_date: details.finished_date ? new Date(details.finished_date).toISOString() : ''
        };

        console.log('Sending data:', updatedDetails);

        try {
            await axios.put(`/devices/${device.id}/`, updatedDetails);
            toast.success('Dispositivo editado exitosamente');
            refreshDevices();
            closeModal();
        } catch (error) {
            console.error('Error updating device:', error);
            if (error.response && error.response.data) {
                console.log("Error data:", error.response.data);
            }
            toast.error('Error al editar dispositivo');
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal} ariaLabel="Detalles del dispositivo">
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Editar Dispositivo</h2>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Dispositivo</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="name"
                            value={details.name}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Estado del dispositivo</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="device_status"
                            value={details.device_status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un estado</option>
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
                            value={details.start_date}
                            onChange={handleDateChange}
                        />
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Fecha de finalización</label>
                        <input
                            type="datetime-local"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="finished_date"
                            value={details.finished_date}
                            onChange={handleDateChange}
                        />
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Descripción</label>
                        <textarea
                            className="mt-1 p-2 border border-gray-300 rounded h-20 resize-none"
                            name="description"
                            value={details.description}
                            onChange={handleChange}
                        />
                    </div>
    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Código Único</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="unique_code"
                            value={details.unique_code}
                            readOnly
                        />
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">URL de Consulta</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="url"
                            value={`${window.location.origin}/device-status`}
                            readOnly
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
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default DeviceDetails;