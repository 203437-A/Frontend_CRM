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
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Crear Categoría</h2>
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
                        <button type="button" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={resetAndClose}>Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Crear</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ClientCategoryCreate;
