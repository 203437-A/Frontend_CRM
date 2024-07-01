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

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
            fetchClients();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Updating form data: ", name, value);
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

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Crear Proyecto</h2>
                    <div className="full-width">
                        <label className="form-label">Nombre del Encargado</label>
                        <select
                            className="form-select"
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
                    <div className="full-width">
                        <label className="form-label">Nombre del Cliente</label>
                        <select
                            className="form-select"
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
                    <div className="form-row">
                        <div className="form-column">
                            <label className="form-label">Nombre del Proyecto</label>
                            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
                            
                            <label className="form-label">Fecha de inicio</label>
                            <input type="datetime-local" className="form-input" name="start_date" value={formData.start_date} onChange={handleChange} required />
                            
                        </div>
                        <div className="form-column">
                            <label className="form-label">Estado del Proyecto</label>
                            <select className="form-select" name="status" value={formData.status} onChange={handleChange} required>
                                <option value="activo">Activo</option>
                                <option value="completado">Completado</option>
                                <option value="pausado">Pausado</option>
                            </select>

                            <label className="form-label">Fecha de finalización</label>
                            <input type="datetime-local" className="form-input" name="finished_date" value={formData.finished_date} onChange={handleChange} required />

                        </div>
                    </div>
                    <div className="full-width">
                        <label className="form-label">Descripción</label>
                        <textarea className="form-input-details" name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="button-cancel" onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="button-submit">Crear Proyecto</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ProjectCreate;
