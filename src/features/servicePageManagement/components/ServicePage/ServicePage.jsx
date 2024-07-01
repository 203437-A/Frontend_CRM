import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import styles from './servicePage.module.css'; 
import ServicePageDetails from '../ServicePageDetails/ServicePageDetails'; 
import ServicePageCreate from '../ServicePageCreate/ServicePageCreate';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'

export default function ServicePage() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [filters, setFilters] = useState({
        serviceName: ""
    });

    const [filteredServices, setFilteredServices] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [services, filters]);

    const fetchServices = async () => {
        try {
            const response = await axios.get('/services/'); 
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Error al cargar los servicios');
        }
    };

    const handleDeleteService = async (id) => {
        try {
            await axios.delete(`/services/${id}/`);
            fetchServices();
            toast.success('Servicio eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Error al eliminar el servicio');
        }
    };

    const filterServices = () => {
        const tempServices = services.filter(service =>
            service.name.toLowerCase().includes(filters.serviceName.toLowerCase())
        );
        setFilteredServices(tempServices);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const openDetailsModal = (service) => {
        setSelectedService(service);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
    };

    const downloadPDF = async (serviceId) => {
        try {
            const response = await axios.get(`services/${serviceId}/pdf/`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `service_${serviceId}.pdf`); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);  
        } catch (error) {
            console.error('Error downloading the PDF document: ', error);
            toast.error('Error al descargar el PDF');
        }
    };

    return (
        <div className='home'>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className='title-container'>Gestión de Servicios</h2>
            <div className={styles.filterContainer}>
                <span>FILTROS</span>
                <input 
                    type="text" 
                    name="serviceName" 
                    placeholder="Buscar por nombre del servicio..." 
                    value={filters.serviceName} 
                    onChange={handleFilterChange} 
                />
            </div>
            <table className={styles.styledTable}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Horas invertidas</th>
                        <th>Costo de materiales</th>
                        <th>Costo total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredServices.map(service => (
                        <tr key={service.id}>
                            <td data-tooltip-id="service-tooltip" data-tooltip-content={service.project_name}>{service.project_name}</td>
                            <td data-tooltip-id="service-tooltip" data-tooltip-content={service.description}>{service.description}</td>
                            <td>{service.inverted_hours} horas</td>
                            <td>${service.material_cost}</td>
                            <td>${service.total_cost}</td>
                            <td>
                                <button onClick={() => downloadPDF(service.id)} className={styles.iconBtn}>
                                        <i className='bx bxs-file-pdf edit'></i>
                                </button>
                                <button onClick={() => openDetailsModal(service)} className={styles.iconBtn}>
                                    <i className='bx bxs-edit-alt edit'></i>
                                </button>
                                <button onClick={() => handleDeleteService(service.id)} className={styles.iconBtn}>
                                    <i className='bx bxs-trash-alt delete'></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactTooltip id="service-tooltip" multiline={true} effect="solid"/>
            <ServicePageDetails
                isOpen={isDetailsModalOpen}
                closeModal={closeDetailsModal}
                service={selectedService}
                refreshServices={fetchServices}
            />
            <button className={styles.createButton} onClick={openModal}>Crear Servicio</button>
            <ServicePageCreate
                isOpen={isModalOpen}
                closeModal={closeModal}
                refreshServices={fetchServices}
            />
        </div>
    );
}
