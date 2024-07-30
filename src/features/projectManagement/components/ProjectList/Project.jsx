import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProjectDetails from '../ProjectDetails/ProjectDetails'; 
import ProjectCreate from '../ProjectCreate/ProjectCreate';
import ProjectCalendarSettings from '../../../calendarManagement/components/CalendarSettings/ProjectCalendarSettings'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Project() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openSettingsModal = () => setIsSettingsModalOpen(true);
    const closeSettingsModal = () => setIsSettingsModalOpen(false);
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
        <div className="home p-5">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">Gestión de Proyectos</h2>
            <div className="mb-5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-700">FILTROS</span>
                <input
                    type="text"
                    name="clientName"
                    placeholder="Buscar por nombre del cliente..."
                    value={filters.clientName}
                    onChange={handleFilterChange}
                    className="flex-grow p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="projectName"
                    placeholder="Buscar por nombre del proyecto..."
                    value={filters.projectName}
                    onChange={handleFilterChange}
                    className="flex-grow p-2 border border-gray-300 rounded"
                />
                <select
                    name="projectStatus"
                    value={filters.projectStatus}
                    onChange={handleFilterChange}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="completado">Completado</option>
                    <option value="pausado">Pausado</option>
                </select>
            </div>
            <div className="mb-5 flex justify-center gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={openModal}>Crear Proyecto</button>
                <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800" onClick={openSettingsModal}>Opciones</button>
            </div>
            <div className="flex flex-wrap gap-5 justify-center">
                {filteredProjects.map(project => (
                    <div key={project.id} className="bg-white rounded shadow-md w-full max-w-sm p-5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                            <p className="mb-2"><strong>Cliente:</strong> {project.client_name}</p>
                            <p className="mb-2"><strong>Descripción:</strong> {project.description}</p>
                            <p className="mb-2"><strong>Estado del proyecto:</strong> {project.status_display}</p>
                            <p className="mb-2"><strong>Encargado:</strong> {project.manage_user_name}</p>
                            <p className="mb-2"><strong>Fecha de inicio:</strong> {formatDate(project.start_date)}</p>
                            <p className="mb-2"><strong>Fecha de finalización:</strong> {project.finished_date ? formatDate(project.finished_date) : 'N/A'}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <button onClick={() => openTasksPage(project.id)} className="text-xl text-black-600 hover:text-green-600">
                                <i className='bx bx-task'></i>
                            </button>
                            <button onClick={() => openDetailsModal(project)} className="text-xl text-black-600 hover:text-blue-600">
                                <i className='bx bxs-edit-alt'></i>
                            </button>
                            <button onClick={() => handleDeleteProject(project.id)} className="text-xl text-black-600 hover:text-red-600">
                                <i className='bx bxs-trash-alt'></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ProjectDetails
                isOpen={isDetailsModalOpen}
                closeModal={closeDetailsModal}
                project={selectedProject}
                refreshProjects={fetchProjects}
            />
            <ProjectCreate
                isOpen={isModalOpen}
                closeModal={closeModal}
                refreshProjects={fetchProjects}
            />
            <ProjectCalendarSettings
                isOpen={isSettingsModalOpen}
                closeModal={closeSettingsModal}
            />
        </div>
    );
}
