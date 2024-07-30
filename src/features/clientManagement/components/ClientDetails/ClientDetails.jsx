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
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Editar cliente</h2>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Nombre</label>
                        <input
                            className="mt-1 p-2 border border-gray-300 rounded"
                            type="text"
                            name="first_name"
                            value={details.first_name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Apellido</label>
                        <input
                            className="mt-1 p-2 border border-gray-300 rounded"
                            type="text"
                            name="last_name"
                            value={details.last_name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Email</label>
                        <input
                            className="mt-1 p-2 border border-gray-300 rounded"
                            type="email"
                            name="email"
                            value={details.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Teléfono</label>
                        <input
                            className="mt-1 p-2 border border-gray-300 rounded"
                            type="text"
                            name="phone_number"
                            value={details.phone_number}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Detalles</label>
                        <textarea
                            className="mt-1 p-2 border border-gray-300 rounded h-20 resize-none"
                            name="details"
                            value={details.details}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Categorías</label>
                        <Select
                            isMulti
                            options={categories.map(category => ({ label: category.name, value: category.id }))}
                            className="basic-multi-select mt-1"
                            classNamePrefix="select"
                            onChange={handleCategoryChange}
                            value={details.categories}
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
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ClientDetails;
