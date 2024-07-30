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
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Editar Categoría</h2>
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Nombre de la categoría</label>
                        <input
                            className="mt-1 p-2 border border-gray-300 rounded"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button type="button" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Actualizar</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ClientCategoryDetails;

