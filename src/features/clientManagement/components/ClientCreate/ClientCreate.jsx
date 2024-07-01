import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../../../../components/common/Modal/Modal'; 
import { toast } from 'react-toastify';
import Select from 'react-select';

const ClientCreate = ({ isOpen, closeModal, refreshClients, categories }) => {
    const initialFormData = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        details: '',
        categories: []
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCategoryChange = (selectedOptions) => {
        const categories = selectedOptions || [];
        setFormData({ ...formData, categories: categories.map(option => option.value) });
    };

    const resetFormData = () => {
        setFormData(initialFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/clients/', formData);
            refreshClients();
            closeModal();
            resetFormData();
            toast.success('Cliente creado exitosamente');
        } catch (error) {
            console.error('Error creating client:', error);
            toast.error('Error al crear cliente');
        }
    };

    const handleClose = () => {
        resetFormData();
        closeModal();
    };

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }));

    return (
        <Modal isOpen={isOpen} closeModal={handleClose}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Crear Cliente</h2>
                    <div className="form-row">
                        <div className="form-column">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-input" name="first_name" value={formData.first_name} onChange={handleChange} required />
                            <label className="form-label">Apellido</label>
                            <input type="text" className="form-input" name="last_name" value={formData.last_name} onChange={handleChange} required />
                        </div>
                        <div className="form-column">
                            <label className="form-label">Correo</label>
                            <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required />
                            <label className="form-label">Teléfono</label>
                            <input type="text" className="form-input" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="full-width">
                        <label className="form-label">Detalles</label>
                        <textarea className="form-input-details" name="details" value={formData.details} onChange={handleChange} required />
                    </div>
                    <div className="full-width">
                        <label className="form-label">Categorías</label>
                        <Select
                            isMulti
                            options={categoryOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleCategoryChange}
                            value={categoryOptions.filter(option => formData.categories.includes(option.value))}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="button-cancel" onClick={handleClose}>Cancelar</button>
                        <button type="submit" className="button-submit">Crear Cliente</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ClientCreate;
