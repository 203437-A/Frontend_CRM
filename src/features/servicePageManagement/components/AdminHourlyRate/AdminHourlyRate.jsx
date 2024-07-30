import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminHourlyRate = ({ isOpen, closeModal, currentRate, updateRate }) => {
    const [newRate, setNewRate] = useState(currentRate);

    useEffect(() => {
        if (isOpen) {
            setNewRate(currentRate);
        }
    }, [isOpen, currentRate]);

    const handleChange = (e) => {
        setNewRate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateRate(newRate);
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Actualizar Precio por Hora</h2>
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Precio por Hora</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            value={newRate}
                            onChange={handleChange}
                            required
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
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AdminHourlyRate;
