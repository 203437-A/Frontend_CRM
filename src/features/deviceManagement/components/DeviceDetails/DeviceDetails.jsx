import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../../../../components/common/Modal/Modal'; 
import 'react-toastify/dist/ReactToastify.css';

const DeviceDetails = ({ isOpen, closeModal, device, refreshDevices }) => {
    const [details, setDetails] = useState({
        client: '',
        name: '',
        description: '',
        device_status: '',
        start_date: '',
        finished_date: ''
    });

    useEffect(() => {
        if (device) {
            setDetails({
                client: device.client || '',
                name: device.name || '',
                description: device.description || '',
                device_status: device.device_status || '',
                start_date: device.start_date ? formatToLocalDateTime(device.start_date) : '',
                finished_date: device.finished_date ? formatToLocalDateTime(device.finished_date) : ''
            });
        }
    }, [device]);

    const formatToLocalDateTime = (date) => {
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedDetails = {
            ...details,
            start_date: details.start_date ? new Date(details.start_date).toISOString() : '',
            finished_date: details.finished_date ? new Date(details.finished_date).toISOString() : ''
        };

        console.log('Sending data:', updatedDetails);

        try {
            const response = await axios.put(`/devices/${device.id}/`, updatedDetails);
            toast.success('Dispositivo editado exitosamente');
            refreshDevices();
            closeModal();
        } catch (error) {
            console.error('Error updating device:', error);
            if (error.response && error.response.data) {
                console.log("Error data:", error.response.data);
            }
            toast.error('Error al editar dispositivo');
        }
    };

    return (
        <Modal isOpen={isOpen} closeModal={closeModal} ariaLabel="Detalles del dispositivo">
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h2>Editar Dispositivo</h2>
                    <div className='form-row'>
                        <div className='form-column'>
                            <label className="form-label">Dispositivo</label>
                            <input type="text" className="form-input" name="name" value={details.name} onChange={handleChange} />
                        </div>
                        <div className='form-column'>
                            <label className="form-label">Estado del dispositivo</label>
                            <select className="form-select" name="device_status" value={details.device_status} onChange={handleChange} required>
                                <option value="">Seleccione un estado</option>
                                <option value="en_reparacion">En reparación</option>
                                <option value="reparado">Reparado</option>
                                <option value="entregado">Entregado</option>
                            </select>
                        </div>
                    </div>
                    <div className="full-width">
                        <label className="form-label">Fecha de inicio</label>
                        <input type="datetime-local" className="form-input" name="start_date" value={details.start_date} onChange={handleChange} />

                        <label className="form-label">Fecha de finalización</label>
                        <input type="datetime-local" className="form-input" name="finished_date" value={details.finished_date} onChange={handleChange} />

                        <label className="form-label">Descripción</label>
                        <textarea className="form-input-details" name="description" value={details.description} onChange={handleChange} />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="button-cancel" onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="button-submit">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default DeviceDetails;
