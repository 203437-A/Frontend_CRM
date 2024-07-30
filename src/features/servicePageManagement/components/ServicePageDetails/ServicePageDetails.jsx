import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../../../../components/common/Modal/Modal'; 
import 'react-toastify/dist/ReactToastify.css';

const ServicePageDetails = ({ isOpen, closeModal, service, refreshServices, hourlyRate }) => {
    const [details, setDetails] = useState({
        project: '',
        project_name:'',
        description: '',
        inverted_hours: '',
        material_cost: '',
        total_cost: ''
    });

    useEffect(() => {
        if (service) {
            setDetails({
                project: service.project,
                project_name: service.project_name,
                description: service.description || '',
                inverted_hours: service.inverted_hours || '',
                material_cost: service.material_cost || '',
                total_cost: service.total_cost || ''
            });
        }
    }, [service]);

    useEffect(() => {
        if (isOpen && service) {
            calculateTotalCost();
        }
    }, [details.inverted_hours, details.material_cost, hourlyRate, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const calculateTotalCost = () => {
        const totalCost = (parseFloat(details.inverted_hours) * parseFloat(hourlyRate)) + parseFloat(details.material_cost);
        setDetails(prevDetails => ({ ...prevDetails, total_cost: totalCost.toFixed(2) }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            await axios.put(`/services/${service.id}/`, details);
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
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Editar Servicio</h2>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Nombre del Servicio</label>
                        <input
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="name"
                            value={details.project_name}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Descripción</label>
                        <textarea
                            className="mt-1 p-2 border border-gray-300 rounded h-20 resize-none"
                            name="description"
                            value={details.description}
                            onChange={handleChange}
                        />
                    </div>
    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Horas invertidas</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="inverted_hours"
                            value={details.inverted_hours}
                            onChange={handleChange}
                        />
                    </div>
    
                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Costo de materiales</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="material_cost"
                            value={details.material_cost}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Costo total</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="total_cost"
                            value={details.total_cost}
                            readOnly
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

export default ServicePageDetails;
