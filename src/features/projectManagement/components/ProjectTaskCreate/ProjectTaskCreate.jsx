import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../../../components/common/Modal/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjectTaskCreate = ({ isOpen, closeModal, refreshTasks, projectId, projectName }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'pendiente',
        employee: '',
        start_date: '',
        finished_date: '',
        project: projectName // Inicializar con el nombre del proyecto
    });
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
        }
    }, [isOpen]);

    useEffect(() => {
        // Actualizar el nombre del proyecto en formData cuando cambie projectName
        setFormData(prevFormData => ({
            ...prevFormData,
            project: projectName
        }));
    }, [projectName]);

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
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formattedFormData = {
            ...formData,
            project: projectId, // Asignar el ID del proyecto a la tarea
            start_date: formData.start_date ? new Date(formData.start_date).toISOString() : '',
            finished_date: formData.finished_date ? new Date(formData.finished_date).toISOString() : ''
        };

        try {
            await axios.post('/tasks/', formattedFormData);
            refreshTasks();
            toast.success('Tarea creada exitosamente');
            closeModal();
            setFormData({
                name: '',
                description: '',
                status: 'pendiente',
                employee: '',
                start_date: '',
                finished_date: '',
                project: projectName // Restablecer el nombre del proyecto
            });
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Error al crear tarea');
            if (error.response && error.response.data) {
                const errors = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value.join(' ')}`).join('\n');
                toast.error(`Error al crear tarea: ${errors}`);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Crear Tarea</h2>
                    <div className="full-width">
                        <label className="form-label">Proyecto</label>
                        <input type="text" className="form-input" name="project" value={formData.project} disabled />
                    </div>
                    <div className="full-width">
                        <label className="form-label">Empleado encargado</label>
                        <select
                            className="form-select"
                            name="employee"
                            value={formData.employee}
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
                    <div className="form-row">
                        <div className="form-column">
                            <label className="form-label">Nombre de la Tarea</label>
                            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
                            
                            <label className="form-label">Fecha de inicio</label>
                            <input type="datetime-local" className="form-input" name="start_date" value={formData.start_date} onChange={handleChange} required />
                            
                        </div>
                        <div className="form-column">
                            <label className="form-label">Estado de la Tarea</label>
                            <select className="form-select" name="status" value={formData.status} onChange={handleChange} required>
                                <option value="pendiente">Pendiente</option>
                                <option value="en_progreso">En progreso</option>
                                <option value="completada">Completada</option>
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
                        <button type="submit" className="button-submit">Crear Tarea</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ProjectTaskCreate;
