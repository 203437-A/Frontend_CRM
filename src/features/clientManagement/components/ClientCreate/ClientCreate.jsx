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
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Crear Cliente</h2>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Apellido</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Correo</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Detalles</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded h-20 resize-none"
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Categorías</label>
                        <Select
                            isMulti
                            options={categoryOptions}
                            className="basic-multi-select mt-1"
                            classNamePrefix="select"
                            onChange={handleCategoryChange}
                            value={categoryOptions.filter(option => formData.categories.includes(option.value))}
                        />
                    </div>

                    <div className="col-span-2 flex justify-between mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ClientCreate;
