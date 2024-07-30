import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    
    let navigate = useNavigate();
    function goToCategories() {
        navigate('/client/categories');
    }
    
    return (
        <div className="home p-5">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">Clientes</h2>
            <div className="mb-5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-700">FILTROS</span>
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={filter}
                    onChange={handleFilterChange}
                    className="flex-grow p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-5 flex justify-center gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800" onClick={goToCategories}>Categorias</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={openModal}>Crear cliente</button>
            </div>
            <div className="flex flex-wrap gap-5 justify-center">
                {filteredClients.map(client => (
                    <div key={client.id} className="bg-white rounded shadow-md w-full max-w-sm p-5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-2">{client.first_name} {client.last_name}</h3>
                            <p className="mb-2"><strong>Correo:</strong> {client.email}</p>
                            <p className="mb-2"><strong>Teléfono:</strong> {client.phone_number}</p>
                            <p className="mb-2"><strong>Detalles:</strong> {client.details}</p>
                            <p className="mb-2"><strong>Categorías:</strong> {getCategoryNames(client.categories)}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <button onClick={() => handleSelectClient(client)} className="text-xl text-black-600 hover:text-blue-600">
                                <i className='bx bxs-edit-alt'></i>
                            </button>
                            <button onClick={() => handleDeleteClient(client.id)} className="text-xl text-black-600 hover:text-red-600">
                                <i className='bx bxs-trash-alt'></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ReactTooltip id="client-tooltip" multiline={true} effect="solid"/>
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
