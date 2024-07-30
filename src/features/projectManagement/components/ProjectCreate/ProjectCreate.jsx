import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../../../components/common/Modal/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjectCreate = ({ isOpen, closeModal, refreshProjects }) => {
    const [formData, setFormData] = useState({
        manage_user: '',
        client: '',
        name: '',
        description: '',
        status: 'activo',
        start_date: '',
        finished_date: ''
    });
    const [employees, setEmployees] = useState([]);
    const [clients, setClients] = useState([]);
    const [settings, setSettings] = useState({
        allow_weekends: false,
        start_hour: "08:00",
        end_hour: "16:00"
    });
    const [occupiedDates, setOccupiedDates] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
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

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/employees/');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Error al cargar la lista de empleados');
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/project-calendar-settings/');
            setSettings(response.data);
        } catch (error) {
            console.error('Error fetching calendar settings:', error);
            toast.error('Error al cargar las configuraciones del calendario');
        }
    };

    const fetchOccupiedDates = async () => {
        try {
            const response = await axios.get('/project-occupied-dates/');
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
            await axios.post('/projects/', formattedFormData);
            refreshProjects();
            toast.success('Proyecto creado exitosamente');
            closeModal();
            setFormData({
                manage_user: '',
                client: '',
                name: '',
                description: '',
                status: 'activo',
                start_date: '',
                finished_date: ''
            });
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error('Error al crear proyecto');
            if (error.response && error.response.data) {
                const errors = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value.join(' ')}`).join('\n');
                toast.error(`Error al crear proyecto: ${errors}`);
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
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Crear Proyecto</h2>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Nombre del Encargado</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="manage_user"
                            value={formData.manage_user}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un empleado</option>
                            {employees.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.first_name} {employee.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Nombre del Cliente</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.first_name} {client.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Nombre del Proyecto</label>
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
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Estado del Proyecto</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="activo">Activo</option>
                            <option value="completado">Completado</option>
                            <option value="pausado">Pausado</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col">
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

export default ProjectCreate;
