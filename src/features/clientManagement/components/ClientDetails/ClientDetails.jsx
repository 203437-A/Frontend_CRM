import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../../../../components/common/Modal/Modal'; 
import Select from 'react-select';

const ClientDetails = ({ isOpen, closeModal, client, refreshClients, categories }) => {
    const [details, setDetails] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        details: '',
        categories: []
    });

    useEffect(() => {
        if (client) {
            setDetails({
                first_name: client.first_name,
                last_name: client.last_name,
                email: client.email,
                phone_number: client.phone_number,
                details: client.details,
                categories: client.categories.map(cat => ({ label: cat.name, value: cat.id }))
            });
        }
    }, [client]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleCategoryChange = selectedOptions => {
        setDetails(prevDetails => ({ ...prevDetails, categories: selectedOptions || [] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedDetails = {
                ...details,
                categories: details.categories.map(cat => cat.value)
            };
            await axios.put(`/clients/${client.id}/`, updatedDetails);
            refreshClients();
            closeModal();
            toast.success('Detalles del cliente actualizados con éxito');
        } catch (error) {
            console.error('Error updating client details:', error);
            toast.error('Error al actualizar los detalles del cliente');
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Editar cliente</h2>
                    <div className="form-row">
                        <div className='form-column'>
                            <label className="form-label">Nombre</label>
                            <input className="form-input" type="text" name="first_name" value={details.first_name} onChange={handleInputChange} />
                            <label className="form-label">Apellido</label>
                            <input className="form-input" type="text" name="last_name" value={details.last_name} onChange={handleInputChange} />
                        </div>
                        <div className="form-column">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" name="email" value={details.email} onChange={handleInputChange} />
                            <label className="form-label">Teléfono</label>
                            <input className="form-input" type="text" name="phone_number" value={details.phone_number} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="full-width">
                        <label className="form-label">Detalles</label>
                        <textarea className="form-input-details" name="details" value={details.details} onChange={handleInputChange} />
                    </div>
                    <div className="full-width">
                        <label className="form-label">Categorías</label>
                        <Select
                            isMulti
                            options={categories.map(category => ({ label: category.name, value: category.id }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleCategoryChange}
                            value={details.categories}
                        />
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

export default ClientDetails;
