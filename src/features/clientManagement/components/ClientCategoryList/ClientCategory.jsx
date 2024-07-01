import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import styles from './clientCategory.module.css';
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
        <div className='home'>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className='title-container'>Categorías</h2>
            <div className={styles.filterContainer}>
                <span>FILTROS</span>
                <input type="text" placeholder="Buscar por nombre..." value={filter} onChange={handleFilterChange} />
            </div>
            <table className={styles.styledTable}>
                <thead>
                    <tr>
                        <th>Nombre de la categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.map(category => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>
                                <button onClick={() => handleSelectCategory(category)} className={styles.iconBtn}>
                                    <i className='bx bxs-edit-alt edit'></i>
                                </button>
                                <button onClick={() => handleDeleteCategory(category.id)} className={styles.iconBtn}>
                                    <i className='bx bxs-trash-alt delete' ></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.buttonContainer}>
                <button className={styles.createButton} onClick={goToClient}>Regresar a Clientes</button>
                <button className={styles.createButton} onClick={() => setIsCreateModalOpen(true)}>Crear Categoría</button>
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
