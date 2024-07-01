import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './project.module.css'; 
import ProjectDetails from '../ProjectDetails/ProjectDetails'; 
import ProjectCreate from '../ProjectCreate/ProjectCreate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function Project() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [filters, setFilters] = useState({
        clientName: "",
        projectName: "",
        projectStatus: ""
    });

    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        filterProjects();
    }, [projects, filters]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/projects/');
            setProjects(response.data);
            console.log(response);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await axios.delete(`/projects/${id}/`);
            fetchProjects();
            toast.success('Proyecto eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting project:', error);
            if (error.response && error.response.status === 403) {
                toast.error('No tienes permiso para eliminar este proyecto.');
            } else {
                toast.error('Error al eliminar proyecto');
            }
        }
    };

    const filterProjects = () => {
        let tempProjects = projects.filter(project =>
            project.client_name.toLowerCase().includes(filters.clientName.toLowerCase()) &&
            project.name.toLowerCase().includes(filters.projectName.toLowerCase()) &&
            project.status.toLowerCase().includes(filters.projectStatus.toLowerCase())
        );
        setFilteredProjects(tempProjects);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    };

    const openDetailsModal = (project) => {
        setSelectedProject(project);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
    };

    let navigate = useNavigate(); 

    const openTasksPage = (projectId) => {
        navigate(`/project/${projectId}/tasks`);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className='home'>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className='title-container'>Gestión de Proyectos</h2>
            <div className={styles.filterContainer}>
                <span>FILTROS</span>
                <input 
                    type="text" 
                    name="clientName" 
                    placeholder="Buscar por nombre del cliente..." 
                    value={filters.clientName} 
                    onChange={handleFilterChange} 
                />
                <input 
                    type="text" 
                    name="projectName" 
                    placeholder="Buscar por nombre del proyecto..." 
                    value={filters.projectName} 
                    onChange={handleFilterChange} 
                />
                <select 
                    name="projectStatus" 
                    value={filters.projectStatus} 
                    onChange={handleFilterChange}
                >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="completado">Completado</option>
                    <option value="pausado">Pausado</option>
                </select>
            </div>
            <table className={styles.styledTable}>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Proyecto</th>
                        <th>Descripción</th>
                        <th>Estado del proyecto</th>
                        <th>Encargado</th>
                        <th>Fecha de inicio</th>
                        <th>Fecha de finalización</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProjects.map(project => (
                        <tr key={project.id}>
                            <td>{project.client_name}</td>
                            <td data-tooltip-id="project-tooltip" data-tooltip-content={project.name}>{project.name}</td>
                            <td data-tooltip-id="project-tooltip" data-tooltip-content={project.description}>{project.description}</td>
                            <td>{project.status_display}</td>
                            <td>{project.manage_user_name}</td>
                            <td data-tooltip-id="project-tooltip" data-tooltip-content={formatDate(project.start_date)}>{formatDate(project.start_date)}</td>
                            <td data-tooltip-id="project-tooltip" data-tooltip-content={formatDate(project.finished_date)}>{project.finished_date ? formatDate(project.finished_date) : 'N/A'}</td>
                            <td>
                                <button onClick={() => openTasksPage(project.id)} className={styles.iconBtn}>
                                    <i className='bx bx-task'></i>
                                </button>
                                <button onClick={() => openDetailsModal(project)} className={styles.iconBtn}>
                                    <i className='bx bxs-edit-alt edit'></i>
                                </button>
                                <button onClick={() => handleDeleteProject(project.id)} className={styles.iconBtn}>
                                    <i className='bx bxs-trash-alt delete'></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactTooltip id="project-tooltip" multiline={true} effect="solid"/>
            <ProjectDetails
                isOpen={isDetailsModalOpen}
                closeModal={closeDetailsModal}
                project={selectedProject}
                refreshProjects={fetchProjects}
            />
            <button className={styles.createButton} onClick={openModal}>Crear Proyecto</button>
            <ProjectCreate
                isOpen={isModalOpen}
                closeModal={closeModal}
                refreshProjects={fetchProjects}
            />
        </div>
    );
}
