import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../../../../components/common/Modal/Modal'; 
import 'react-toastify/dist/ReactToastify.css';

const ServicePageDetails = ({ isOpen, closeModal, service, refreshServices }) => {
    const [details, setDetails] = useState({
        project: '',
        name: '',
        description: '',
        inverted_hours: '',
        material_cost: '',
        total_cost: ''
    });

    useEffect(() => {
        if (service) {
            setDetails({
                project: service.id,
                name: service.name || '',
                description: service.description || '',
                inverted_hours: service.inverted_hours || '',
                material_cost: service.material_cost || '',
                total_cost: service.total_cost || ''
            });
        }
    }, [service]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        console.log('Sending data:', details); 
    
        try {
            const response = await axios.put(`/services/${service.id}/`, details);
            toast.success('Servicio actualizado exitosamente');
            refreshServices();
            closeModal();
        } catch (error) {
            console.error('Error updating service:', error);
            if (error.response && error.response.data) {
                console.log("Error data:", error.response.data);
            }
            toast.error('Error al actualizar el servicio');
        }
    };
    
    return (
        <Modal isOpen={isOpen} closeModal={closeModal} ariaLabel="Detalles del servicio">
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h2>Editar Servicio</h2>
                    <div className="full-width">
                        <label className="form-label">Nombre del Proyecto</label>
                        <input type="text" className="form-input" name="name" value={details.name} onChange={handleChange} disabled/>

                        <label className="form-label">Descripción</label>
                        <textarea className="form-input-details" name="description" value={details.description} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className='form-column'>

                            <label className="form-label">Horas invertidas</label>
                            <input type="number" className="form-input" name="inverted_hours" value={details.inverted_hours} onChange={handleChange} />
                        </div>
                        <div className='form-column'>
                            <label className="form-label">Costo de materiales</label>
                            <input type="number" className="form-input" name="material_cost" value={details.material_cost} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="full-width">
                        <label className="form-label">Costo total</label>
                        <input type="number" className="form-input" name="total_cost" value={details.total_cost} onChange={handleChange} />
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

export default ServicePageDetails;
