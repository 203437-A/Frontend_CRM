import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../../../components/common/Modal/Modal'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CalendarSettings = ({ isOpen, closeModal }) => {
    const [settings, setSettings] = useState({
        allow_weekends: false,
        start_hour: "08:00",
        end_hour: "16:00"
    });
    const [occupiedDates, setOccupiedDates] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchSettings();
            fetchOccupiedDates();
        }
    }, [isOpen]);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/calendar-settings/');
            const { allow_weekends, start_hour, end_hour } = response.data;
            setSettings({
                allow_weekends: allow_weekends ?? false,
                start_hour: start_hour ?? "08:00",
                end_hour: end_hour ?? "16:00"
            });
        } catch (error) {
            console.error('Error fetching calendar settings:', error);
            toast.error('Error al cargar las configuraciones del calendario');
        }
    };

    const fetchOccupiedDates = async () => {
        try {
            const response = await axios.get('/occupied-dates/');
            setOccupiedDates(response.data ?? []);
        } catch (error) {
            console.error('Error fetching occupied dates:', error);
            toast.error('Error al cargar las fechas ocupadas');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put('/calendar-settings/', settings);
            toast.success('Configuraciones del calendario actualizadas');
            closeModal();
        } catch (error) {
            console.error('Error updating calendar settings:', error);
            toast.error('Error al actualizar las configuraciones del calendario');
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="bg-white p-5 rounded-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <h2 className="col-span-2 text-2xl font-bold mb-4">Configuraciones del Calendario</h2>
                    
                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Permitir fines de semana</label>
                        <select
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="allow_weekends"
                            value={String(settings.allow_weekends)}
                            onChange={handleChange}
                        >
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Hora de inicio</label>
                        <input
                            type="time"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="start_hour"
                            value={settings.start_hour}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-gray-700">Hora de finalización</label>
                        <input
                            type="time"
                            className="mt-1 p-2 border border-gray-300 rounded"
                            name="end_hour"
                            value={settings.end_hour}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="font-bold text-gray-700">Fechas Ocupadas</label>
                        <ul className="mt-1 p-2 border border-gray-300 rounded max-h-32 overflow-y-auto">
                            {occupiedDates.map((date, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    {date}
                                </li>
                            ))}
                        </ul>
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

export default CalendarSettings;
