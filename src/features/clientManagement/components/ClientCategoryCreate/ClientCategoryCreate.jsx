import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../../../../components/common/Modal/Modal';

const ClientCategoryCreate = ({ isOpen, closeModal, refreshCategories }) => {
    const [name, setName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/categories/', { name });
            refreshCategories();
            resetAndClose();
            toast.success('Categoría creada exitosamente');
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error('Error al crear categoría');
            if (error.response && error.response.data) {
                const errors = Object.entries(error.response.data)
                                      .map(([key, value]) => `${key}: ${value.join(', ')}`)
                                      .join('; ');
                toast.error(`Error al crear categoría: ${errors}`);
            } else {
                toast.error('Error al crear categoría');
            }
        }
    };

    const resetAndClose = () => {
        setName(""); 
        closeModal();  
    };

    return (
        <Modal isOpen={isOpen} closeModal={resetAndClose}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Crear Categoría</h2>
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
                        <button type="button" className="button-cancel" onClick={resetAndClose}>Cancelar</button>
                        <button type="submit" className="button-submit">Crear Categoria</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ClientCategoryCreate;
