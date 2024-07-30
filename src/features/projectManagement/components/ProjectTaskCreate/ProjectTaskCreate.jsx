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
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Crear Tarea</h2>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Proyecto</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="project"
                            value={formData.project}
                            disabled
                        />
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Empleado encargado</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
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
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Nombre de la Tarea</label>
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
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Estado de la Tarea</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="completa">Completado</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Fecha de finalización</label>
                        <input
                            type="datetime-local"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="finished_date"
                            value={formData.finished_date}
                            onChange={handleChange}
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

export default ProjectTaskCreate;
