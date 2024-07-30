import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../../../components/common/Modal/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ServicePageCreate = ({ isOpen, closeModal, refreshServices, hourlyRate }) => {
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

    useEffect(() => {
        calculateTotalCost();
    }, [formData.inverted_hours, formData.material_cost, hourlyRate]);

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

    const calculateTotalCost = () => {
        const totalCost = (formData.inverted_hours * hourlyRate) + parseFloat(formData.material_cost);
        setFormData({ ...formData, total_cost: totalCost.toFixed(2) });
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
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Crear Servicio</h2>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Proyecto</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
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
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Horas Invertidas</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="inverted_hours"
                            value={formData.inverted_hours}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Costo de Materiales</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="material_cost"
                            value={formData.material_cost}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Costo Total</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="total_cost"
                            value={formData.total_cost}
                            readOnly
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

export default ServicePageCreate;
