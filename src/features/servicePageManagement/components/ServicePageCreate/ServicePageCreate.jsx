import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../../../components/common/Modal/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ServicePageCreate = ({ isOpen, closeModal, refreshServices }) => {
    const [formData, setFormData] = useState({
        project: '',
        name: '',
        description: '',
        inverted_hours: 0,
        material_cost: 0,
        total_cost: 0
    });
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
        }
    }, [isOpen]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/projects/');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Error al cargar la lista de proyectos');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/services/', formData);
            refreshServices();
            toast.success('Servicio creado exitosamente');
            closeModal();
            setFormData({
                project: '',
                name: '',
                description: '',
                inverted_hours: 0,
                material_cost: 0,
                total_cost: 0
            });
        } catch (error) {
            console.error('Error creating service:', error);
            toast.error('Error al crear el servicio');
            if (error.response && error.response.data) {
                const errors = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value.join(' ')}`).join('\n');
                toast.error(`Error al crear servicio: ${errors}`);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Crear Servicio</h2>
                    <div className="full-width">
                        <label className="form-label">Proyecto</label>
                        <select
                            className="form-select"
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un proyecto</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-column">
                            <label className="form-label">Descripcion</label>
                            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />

                            <label className="form-label">Horas Invertidas</label>
                            <input type="number" className="form-input" name="inverted_hours" value={formData.inverted_hours} onChange={handleChange} required />
                        </div>
                        <div className="form-column">
                            <label className="form-label">Costo de Materiales</label>
                            <input type="number" className="form-input" name="material_cost" value={formData.material_cost} onChange={handleChange} required />

                            <label className="form-label">Costo Total</label>
                            <input type="number" className="form-input" name="total_cost" value={formData.total_cost} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="full-width">
                        <label className="form-label">Descripción</label>
                        <textarea className="form-input-details" name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="button-cancel" onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="button-submit">Crear Servicio</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ServicePageCreate;
