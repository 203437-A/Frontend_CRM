import React, { useState, useEffect } from 'react';  
import axios from 'axios';
import Modal from '../../../../components/common/Modal/Modal'; 
import { toast } from 'react-toastify';

const DeviceCreate = ({ isOpen, closeModal, refreshDevices }) => {
    const [formData, setFormData] = useState({
        client: '',
        name: '',
        description: '',
        device_status: 'en_reparacion',
        start_date: '',
        finished_date: ''
    });
    const [clients, setClients] = useState([]);  

    useEffect(() => {
        if (isOpen) {
            fetchClients();  
        }
    }, [isOpen]);  

    const fetchClients = async () => {
        try {
            const response = await axios.get('/clients/');
            setClients(response.data);  
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Error al cargar la lista de clientes');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Updating form data: ", name, value); 
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formattedFormData = {
            ...formData,
            start_date: formData.start_date ? new Date(formData.start_date).toISOString() : '',
            finished_date: formData.finished_date ? new Date(formData.finished_date).toISOString() : ''
        };

        try {
            await axios.post('/devices/', formattedFormData);
            refreshDevices();
            toast.success('Dispositivo creado exitosamente');
            closeModal();
            setFormData({
                client: '',
                name: '',
                description: '',
                device_status: 'en_reparacion',
                start_date: '',
                finished_date: ''
            });
        } catch (error) {
            console.error('Error creating device:', error);
            toast.error('Error al crear dispositivo');
            if (error.response && error.response.data) {
                console.log(error.response.data);
                const errors = Object.entries(error.response.data).map(([key, value]) => {
                    return `${key}: ${value.join(' ')}`;
                }).join('\n');
                toast.error(`Error al crear dispositivo: ${errors}`);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Crear dispositivo/reparación</h2>
                    <div className="full-width">
                        <label className="form-label">Nombre del cliente</label>
                        <select
                            className="form-select"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un cliente</option>
                            {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.first_name} {client.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-column">
                            <label className="form-label">Dispositivo</label>
                            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
                            
                            <label className="form-label">Fecha de inicio</label>
                            <input type="datetime-local" className="form-input" name="start_date" value={formData.start_date} onChange={handleChange} required />
                            
                        </div>
                        <div className="form-column">

                            <label className="form-label">Estado del dispositivo</label>
                            <select className="form-select" name="device_status" value={formData.device_status} onChange={handleChange} required>
                                <option value="en_reparacion">En reparación</option>
                                <option value="reparado">Reparado</option>
                                <option value="entregado">Entregado</option>
                            </select>

                            <label className="form-label">Fecha de finalización</label>
                            <input type="datetime-local" className="form-input" name="finished_date" value={formData.finished_date} onChange={handleChange} required />

                        </div>
                    </div>
                    <div className="full-width">
                        <label className="form-label">Descripción</label>
                        <textarea className="form-input-details" name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="button-cancel" onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="button-submit">Crear Dispositivo</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default DeviceCreate;
