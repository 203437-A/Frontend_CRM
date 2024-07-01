import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './client.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import ClientDetails from '../ClientDetails/ClientDetails'; 
import ClientCreate from '../ClientCreate/ClientCreate'; 
import { useNavigate } from 'react-router-dom';


export default function Client() {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [filter, setFilter] = useState("");
    const [filteredClients, setFilteredClients] = useState([]);
    //
    const [categories, setCategories] = useState([]);
    // const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchClients();
    }, []);
    
    useEffect(() => {
        filterClients();
    }, [clients, filter]);

    //

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Error al cargar categorías');
        }
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get('/clients/');
            setClients(response.data.map(client => ({
                ...client,
                categories: client.categories_detail || []
            })));
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Error al cargar clientes');
        }
    };

    const handleDeleteClient = async (id) => {
        try {
            await axios.delete(`/clients/${id}/`);
            fetchClients();
            toast.success('Cliente eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error('Error al eliminar cliente');
        }
    };
    
    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setIsDetailsModalOpen(true);  
    };

    //FILTROS
    const filterClients = () => {
        let tempClients = clients.filter(cli =>
            cli.first_name.toLowerCase().includes(filter.toLowerCase()) ||
            cli.last_name.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredClients(tempClients);
    };
    
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    //
    const getCategoryNames = (categories) => {
        return categories ? categories.map(category => category.name).join(', ') : '';
    };
    
    let navigate = useNavigate()
    function goToCategories() {
        navigate('/client/categories');
    }
    
    return (
        <div className='home'>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className='title-container'>Clientes</h2>
            <div className={styles.filterContainer}>
                <span>FILTROS</span>
                <input type="text" placeholder="Buscar por nombre..." value={filter} onChange={handleFilterChange} />
            </div>
            <table className={styles.styledTable}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Detalles</th>
                        <th>Categorías</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.map(client => (
                        <tr key={client.id}>
                            <td>{client.first_name}</td>
                            <td>{client.last_name}</td>
                            <td data-tooltip-id="client-tooltip" data-tooltip-content={client.email}>{client.email}</td>
                            <td>{client.phone_number}</td>
                            <td data-tooltip-id="client-tooltip" data-tooltip-content={client.details}>{client.details}</td>
                            <td data-tooltip-id="client-tooltip" data-tooltip-content={getCategoryNames(client.categories)}>{getCategoryNames(client.categories)}</td>
                            <td>
                                <button onClick={() => handleSelectClient(client)} className={styles.iconBtn}>
                                    <i className='bx bxs-edit-alt edit'></i>
                                </button>
                                <button onClick={() => handleDeleteClient(client.id)} className={styles.iconBtn}>
                                    <i className='bx bxs-trash-alt delete'></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactTooltip id="client-tooltip" multiline={true} effect="solid"/>
            <div className={styles.buttonContainer}>
                <button className={styles.createButton} onClick={goToCategories}>Categorias</button>
                <button className={styles.createButton} onClick={openModal}>Crear cliente</button>
            </div>
            <ClientDetails
                isOpen={isDetailsModalOpen}
                closeModal={() => setIsDetailsModalOpen(false)}
                client={selectedClient}
                refreshClients={fetchClients}
                categories={categories}
            />
            <ClientCreate
                isOpen={isModalOpen}
                closeModal={closeModal}
                refreshClients={fetchClients}
                categories={categories}
            />
        </div>
    );
}