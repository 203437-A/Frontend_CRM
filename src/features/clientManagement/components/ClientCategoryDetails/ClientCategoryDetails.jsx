import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../../../../components/common/Modal/Modal'; 

const ClientCategoryDetails = ({ isOpen, closeModal, category, refreshCategories }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`/categories/${category.id}/`, { name });
            refreshCategories();
            closeModal();
            toast.success('Categoría actualizada exitosamente');
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Error al actualizar categoría');
            if (error.response && error.response.data) {
                toast.error(`Error al actualizar categoría: ${error.response.data.detail || error.response.data}`);
            } else {
                toast.error('Error al actualizar categoría');
            }
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Editar Categoría</h2>
                    <div className="full-width">
                        <label className='form-label'>Nombre de la categoría</label>
                        <input
                            className='form-input'
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="button-cancel" onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="button-submit">Actualizar Categoria</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ClientCategoryDetails;

