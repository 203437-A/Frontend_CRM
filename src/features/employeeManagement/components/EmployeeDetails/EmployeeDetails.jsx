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
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h2>Editar Empleado</h2>
                    <div className='form-row'>
                        <div className='form-column'>
                            <label className="form-label">Usuario</label>
                            <input type="text" className="form-input" name="username" value={details.username} onChange={handleChange} />
                
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-input" name="first_name" value={details.first_name} onChange={handleChange} />
                
                            <label className="form-label">Apellido</label>
                            <input type="text" className="form-input" name="last_name" value={details.last_name} onChange={handleChange} />
                        </div>
                        <div className='form-column'>
                            <label className="form-label">Teléfono</label>
                            <input type="text" className="form-input" name="phone_number" value={details.phone_number} onChange={handleChange} />
                
                            <label className="form-label">¿Es administrador?</label>
                            <select className="form-select" name="is_staff" value={details.is_staff} onChange={handleChange}>
                                <option value="false">No</option>
                                <option value="true">Sí</option>
                            </select>
                            <label className="form-label">Contraseña</label>
                            <input type="password" className="form-input" name="password" placeholder="Ingrese nueva contraseña" value={details.password} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='full-width'>
                        <label className="form-label">Correo</label>
                        <input type="email" className="form-input" name="email" value={details.email} onChange={handleChange} />
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


export default EmployeeDetails;
