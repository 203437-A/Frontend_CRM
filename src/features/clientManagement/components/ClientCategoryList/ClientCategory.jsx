import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ClientCategoryCreate from '../ClientCategoryCreate/ClientCategoryCreate';
import ClientCategoryDetails from '../ClientCategoryDetails/ClientCategoryDetails';

export default function ClientCategory() {
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = useMemo(() => categories.filter(cat =>
        cat.name.toLowerCase().includes(filter.toLowerCase())
    ), [categories, filter]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get('/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Error al obtener categorías');
        }
    }, []);

    const handleDeleteCategory = useCallback(async (id) => {
        try {
            await axios.delete(`/categories/${id}/`);
            fetchCategories();
            toast.success('Categoría eliminada exitosamente');
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Error al eliminar categoría');
        }
    }, [fetchCategories]);

    const handleSelectCategory = useCallback((category) => {
        setSelectedCategory(category);
        setIsDetailsModalOpen(true);
    }, []);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const navigate = useNavigate();
    const goToClient = () => navigate('/client');

    return (
        <div className="home p-5">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">Categorías</h2>
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
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800" onClick={goToClient}>Regresar a Clientes</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={() => setIsCreateModalOpen(true)}>Crear Categoría</button>
            </div>
            <div className="flex flex-wrap gap-5 justify-center">
                {filteredCategories.map(category => (
                    <div key={category.id} className="bg-white rounded shadow-md w-full max-w-sm p-5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <button onClick={() => handleSelectCategory(category)} className="text-xl text-black-600 hover:text-blue-600">
                                <i className="bx bxs-edit-alt"></i>
                            </button>
                            <button onClick={() => handleDeleteCategory(category.id)} className="text-xl text-black-600 hover:text-red-600">
                                <i className="bx bxs-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ClientCategoryCreate
                isOpen={isCreateModalOpen}
                closeModal={() => setIsCreateModalOpen(false)}
                refreshCategories={fetchCategories}
            />
            <ClientCategoryDetails
                isOpen={isDetailsModalOpen}
                closeModal={() => setIsDetailsModalOpen(false)}
                category={selectedCategory}
                refreshCategories={fetchCategories}
            />
        </div>
    );
}
