import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../../../../components/common/Modal/Modal'; 
import 'react-toastify/dist/ReactToastify.css';

const ProjectTaskDetails = ({ isOpen, closeModal, task, refreshTasks }) => {
    const [details, setDetails] = useState({
        project: '',
        name: '',
        description: '',
        status: '',
        employee: '',
        start_date: '',
        finished_date: ''
    });
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
        }
    }, [isOpen]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/employees/');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Error al cargar la lista de empleados');
        }
    };

    useEffect(() => {
        if (task) {
            setDetails({
                project: task.project || '',
                name: task.name || '',
                description: task.description || '',
                status: task.status || '',
                employee: task.employee || '',
                start_date: task.start_date ? formatToLocalDateTime(task.start_date) : '',
                finished_date: task.finished_date ? formatToLocalDateTime(task.finished_date) : ''
            });
        }
    }, [task]);

    const formatToLocalDateTime = (date) => {
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
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
            const response = await axios.put(`/tasks/detail/${task.id}/`, updatedDetails);
            toast.success('Tarea editada exitosamente');
            refreshTasks();
            closeModal();
        } catch (error) {
            console.error('Error updating task:', error);
            if (error.response && error.response.data) {
                console.log("Error data:", error.response.data);
            }
            toast.error('Error al editar la tarea');
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal} ariaLabel="Detalles de la tarea">
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h2>Editar Tarea</h2>
                    <div className="full-width">
                        <label className="form-label">Empleado encargado</label>
                        <select
                            className="form-select"
                            name="employee"
                            value={details.employee}
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
                    <div className='form-row'>
                        <div className='form-column'>
                            <label className="form-label">Nombre de la tarea</label>
                            <input type="text" className="form-input" name="name" value={details.name} onChange={handleChange} />

                            <label className="form-label">Fecha de inicio</label>
                            <input type="datetime-local" className="form-input" name="start_date" value={details.start_date} onChange={handleChange} />
                        </div>
                        <div className='form-column'>
                            <label className="form-label">Estado de la tarea</label>
                            <select className="form-select" name="status" value={details.status} onChange={handleChange} required>
                                <option value="">Seleccione un estado</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="en_progreso">En progreso</option>
                                <option value="completa">Completa</option>
                            </select>

                            <label className="form-label">Fecha de finalización</label>
                            <input type="datetime-local" className="form-input" name="finished_date" value={details.finished_date} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="full-width">
                        <label className="form-label">Descripción</label>
                        <textarea className="form-input-details" name="description" value={details.description} onChange={handleChange} />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="button-cancel" onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="button-submit">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ProjectTaskDetails;
