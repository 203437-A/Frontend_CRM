import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../../../../components/common/Modal/Modal'; 
import { toast } from 'react-toastify';

const EmployeeCreate = ({ isOpen, closeModal, refreshEmployees }) => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        is_staff: false,
        password: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/employees/', formData);
            refreshEmployees();  
            setFormData({        
                username: '',
                first_name: '',
                last_name: '',
                phone_number: '',
                is_staff: false,
                password: '',
                email: '',
            });
            closeModal();      
            toast.success('Empleado creado exitosamente');
        } catch (error) {
            console.error('Error creating employee:', error);
            toast.error('Error al crear empleado');
            if (error.response && error.response.data) {
                const errors = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value.join(' ')}`).join('\n');
                toast.error(`Error al crear empleado: ${errors}`);
            } else {
                toast.error('Error al crear empleado');
            }
        }
    };
    

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Crear empleado</h2>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Usuario</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Nombre</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">¿Es administrador?</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="is_staff"
                            value={formData.is_staff}
                            onChange={handleChange}
                            required
                        >
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Apellido</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Correo</label>
                        <input
                            type="email"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-span-2 flex justify-between mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 mr-2"
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

export default EmployeeCreate;
