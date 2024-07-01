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
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Crear empleado</h2>
                    <div className="form-row">
                        <div className="form-column">
                            <label className="form-label">Usuario</label>
                            <input type="text" className="form-input" name="username" value={formData.username} onChange={handleChange} required />

                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-input" name="first_name" value={formData.first_name} onChange={handleChange} required />

                            <label className="form-label">Apellido</label>
                            <input type="text" className="form-input" name="last_name" value={formData.last_name} onChange={handleChange} required />
                        </div>
                        <div className="form-column">
                            <label className="form-label">Teléfono</label>
                            <input type="text" className="form-input" name="phone_number" value={formData.phone_number} onChange={handleChange} required />

                            <label className="form-label">¿Es administrador?</label>
                            <select className="form-select" name="is_staff" value={formData.is_staff} onChange={handleChange} required>
                                <option value="false">No</option>
                                <option value="true">Sí</option>
                            </select>

                            <label className="form-label">Contraseña</label>
                            <input type="password" className="form-input" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="full-width">
                        <label className="form-label">Correo</label>
                        <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="button-cancel" onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="button-submit">Crear Empleado</button>
                    </div>
                </form> 
            </div>
        </Modal>
    );
};

export default EmployeeCreate;
