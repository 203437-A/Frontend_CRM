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
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Editar Tarea</h2>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Empleado encargado</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
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
    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Nombre de la tarea</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="name"
                            value={details.name}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Fecha de inicio</label>
                        <input
                            type="datetime-local"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="start_date"
                            value={details.start_date}
                            onChange={handleChange}
                        />
                    </div>
    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Estado de la tarea</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="status"
                            value={details.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un estado</option>
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
                            value={details.finished_date}
                            onChange={handleChange}
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

export default ProjectTaskDetails;
