import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../../../../components/common/Modal/Modal'; 
import 'react-toastify/dist/ReactToastify.css';

const ProjectDetails = ({ isOpen, closeModal, project, refreshProjects }) => {
    const [details, setDetails] = useState({
        client: '',
        manage_user: '',  
        name: '',
        description: '',
        status: '',
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
        if (project) {
            setDetails({
                client: project.client || '',
                manage_user: project.manage_user || '',
                name: project.name || '',
                description: project.description || '',
                status: project.status || '',
                start_date: project.start_date ? formatToLocalDateTime(project.start_date) : '',
                finished_date: project.finished_date ? formatToLocalDateTime(project.finished_date) : ''
            });
        }
    }, [project]);

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
            const response = await axios.put(`/projects/${project.id}/`, updatedDetails);
            toast.success('Proyecto editado exitosamente');
            refreshProjects();
            closeModal();
        } catch (error) {
            console.error('Error updating project:', error);
            if (error.response && error.response.data) {
                console.log("Error data:", error.response.data);
            }
            toast.error('Error al editar proyecto');
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal} ariaLabel="Detalles del proyecto">
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h2>Editar Proyecto</h2>
                    <div className="full-width">
                        <select
                            className="form-select"
                            name="manage_user"
                            value={details.manage_user}
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
                            <label className="form-label">Nombre del proyecto</label>
                            <input type="text" className="form-input" name="name" value={details.name} onChange={handleChange} />

                            <label className="form-label">Fecha de inicio</label>
                            <input type="datetime-local" className="form-input" name="start_date" value={details.start_date} onChange={handleChange} />
                        </div>
                        <div className='form-column'>
                            <label className="form-label">Estado del proyecto</label>
                            <select className="form-select" name="status" value={details.status} onChange={handleChange} required>
                                <option value="">Seleccione un estado</option>
                                <option value="activo">Activo</option>
                                <option value="completado">Completado</option>
                                <option value="pausado">Pausado</option>
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

export default ProjectDetails;
