import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ServicePageDetails from '../ServicePageDetails/ServicePageDetails'; 
import ServicePageCreate from '../ServicePageCreate/ServicePageCreate';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import AdminHourlyRate from '../AdminHourlyRate/AdminHourlyRate';
import { useAuth } from '../../../../contexts/AuthContext';

export default function ServicePage() {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isHourlyRateModalOpen, setIsHourlyRateModalOpen] = useState(false);
    const [hourlyRate, setHourlyRate] = useState(null);  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openHourlyRateModal = () => setIsHourlyRateModalOpen(true);
    const closeHourlyRateModal = () => setIsHourlyRateModalOpen(false);
    const [filters, setFilters] = useState({
        serviceName: ""
    });

    const [filteredServices, setFilteredServices] = useState([]);

    useEffect(() => {
        fetchServices();
        fetchHourlyRate();
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

    const fetchHourlyRate = async () => {
        try {
            const response = await axios.get('/hourly-rate/');
            setHourlyRate(response.data.rate);
        } catch (error) {
            console.error('Error fetching hourly rate:', error);
            toast.error('Error al cargar el precio por hora');
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
            service.project_name.toLowerCase().includes(filters.serviceName.toLowerCase())
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

    const updateHourlyRate = async (newRate) => {
        try {
            await axios.put('/hourly-rate/', { rate: newRate });
            setHourlyRate(newRate);
            toast.success('Precio por hora actualizado exitosamente');
        } catch (error) {
            console.error('Error updating hourly rate:', error);
            toast.error('Error al actualizar el precio por hora');
        }
    };

    return (
        <div className="home p-5">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">Gestión de Servicios</h2>
            <div className="mb-5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-700">FILTROS</span>
                <input
                    type="text"
                    name="serviceName"
                    placeholder="Buscar por nombre del servicio..."
                    value={filters.serviceName}
                    onChange={handleFilterChange}
                    className="flex-grow p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-5 flex justify-center gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={openModal}>Crear Servicio</button>
                {user?.is_staff && (
                    <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800" onClick={openHourlyRateModal}>Opciones</button>
                )}
            </div>
            <div className="flex flex-wrap gap-5 justify-center">
                {filteredServices.map(service => (
                    <div key={service.id} className="bg-white rounded shadow-md w-full max-w-sm p-5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-2">{service.project_name}</h3>
                            <p className="mb-2"><strong>Descripción:</strong> {service.description}</p>
                            <p className="mb-2"><strong>Horas invertidas:</strong> {service.inverted_hours} horas</p>
                            <p className="mb-2"><strong>Costo de materiales:</strong> ${service.material_cost}</p>
                            <p className="mb-2"><strong>Costo total:</strong> ${(service.inverted_hours * hourlyRate + service.material_cost).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <button onClick={() => downloadPDF(service.id)} className="text-xl text-black-600 hover:text-red-600">
                                <i className='bx bxs-file-pdf edit'></i>
                            </button>
                            <button onClick={() => openDetailsModal(service)} className="text-xl text-black-600 hover:text-blue-600">
                                <i className='bx bxs-edit-alt edit'></i>
                            </button>
                            <button onClick={() => handleDeleteService(service.id)} className="text-xl text-black-600 hover:text-red-600">
                                <i className='bx bxs-trash-alt delete'></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ReactTooltip id="service-tooltip" multiline={true} effect="solid" />
            <ServicePageDetails
                isOpen={isDetailsModalOpen}
                closeModal={closeDetailsModal}
                service={selectedService}
                refreshServices={fetchServices}
                hourlyRate={hourlyRate || 0}
            />
            <ServicePageCreate
                isOpen={isModalOpen}
                closeModal={closeModal}
                refreshServices={fetchServices}
                hourlyRate={hourlyRate || 0}
            />
            <AdminHourlyRate
                isOpen={isHourlyRateModalOpen}
                closeModal={closeHourlyRateModal}
                currentRate={hourlyRate || 0}
                updateRate={updateHourlyRate}
            />
        </div>
    );
}
