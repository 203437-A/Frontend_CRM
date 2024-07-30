import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../../../components/common/Modal/Modal'; 

const EmployeeDetails = ({ isOpen, closeModal, employee, refreshEmployees  }) => {
    const [details, setDetails] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        is_staff: 'false',
        password: ''
    });

    useEffect(() => {
        if (employee) {
            setDetails({
                username: employee.username || '',
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                email: employee.email || '',
                phone_number: employee.phone_number || '',
                is_staff: employee.is_staff ? 'true' : 'false',
                password: ''
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (employee && employee.id) {
            const url = `/employees/${employee.id}/`;
            const updatedDetails = { ...details, is_staff: details.is_staff === 'true' };
    
            if (!details.password) {
                delete updatedDetails.password; 
            }
    
            try {
                const response = await axios.put(url, updatedDetails);
                console.log('Employee updated successfully:', response.data);
                toast.success('Empleado editado exitosamente');
                refreshEmployees(); 
                closeModal(); 
            } catch (error) {
                console.error('Error updating employee:', error);
                toast.error('Error al editar empleado');
            }
        }
    };
    

    return (
        <Modal isOpen={isOpen} closeModal={closeModal} ariaLabel="Detalles del empleado">
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Editar Empleado</h2>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Usuario</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="username"
                            value={details.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="phone_number"
                            value={details.phone_number}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Nombre</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="first_name"
                            value={details.first_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">¿Es administrador?</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="is_staff"
                            value={details.is_staff}
                            onChange={handleChange}
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
                            value={details.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="password"
                            placeholder="Ingrese nueva contraseña"
                            value={details.password}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Correo</label>
                        <input
                            type="email"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="email"
                            value={details.email}
                            onChange={handleChange}
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
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};


export default EmployeeDetails;
