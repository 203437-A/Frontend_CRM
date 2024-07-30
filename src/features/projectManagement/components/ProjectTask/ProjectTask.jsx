import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';
import ProjectTaskDetails from '../ProjectTaskDetails/ProjectTaskDetails';
import ProjectTaskCreate from '../ProjectTaskCreate/ProjectTaskCreate';

function ProjectTasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [filters, setFilters] = useState({
    taskName: "",
    taskStatus: "",
    employee: ""
  });
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  let navigate = useNavigate();

  const fetchProjectAndTasks = async () => {
    try {
      const projectResponse = await axios.get(`/projects/${projectId}`);
      setProject(projectResponse.data);

      const tasksResponse = await axios.get(`/tasks/${projectId}/`);
      setTasks(tasksResponse.data);
    } catch (err) {
      console.error('Error fetching project and tasks:', err);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  useEffect(() => {
    filterTasks();
  }, [tasks, filters]);

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/detail/${id}/`);
      fetchProjectAndTasks();
      toast.success('Tarea eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error.response && error.response.status === 403) {
        toast.error('No tienes permiso para eliminar esta tarea.');
      } else {
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  const filterTasks = () => {
    let tempTasks = tasks.filter(task =>
      task.name.toLowerCase().includes(filters.taskName.toLowerCase()) &&
      task.status.toLowerCase().includes(filters.taskStatus.toLowerCase()) &&
      task.employee_name.toLowerCase().includes(filters.employee.toLowerCase())
    );
    setFilteredTasks(tempTasks);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const openDetailsModal = (task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const goToCategories = () => {
    navigate('/project/');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="home p-5">
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">
            Tareas del Proyecto {project ? project.name : ''}
        </h2>
        <div className="mb-5 flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-700">FILTROS</span>
            <input
                type="text"
                name="taskName"
                placeholder="Buscar por nombre de la tarea..."
                value={filters.taskName}
                onChange={handleFilterChange}
                className="flex-grow p-2 border border-gray-300 rounded"
            />
            <input
                type="text"
                name="employee"
                placeholder="Buscar por empleado encargado..."
                value={filters.employee}
                onChange={handleFilterChange}
                className="flex-grow p-2 border border-gray-300 rounded"
            />
            <select
                name="taskStatus"
                value={filters.taskStatus}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 rounded"
            >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="completa">Completado</option>
                
            </select>
        </div>
        <div className="mb-5 flex justify-center gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800" onClick={goToCategories}>Regresar a Proyectos</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={openModal}>Crear tarea</button>
        </div>
        <div className="flex flex-wrap gap-5 justify-center">
            {filteredTasks.map(task => (
                <div key={task.id} className="bg-white rounded shadow-md w-full max-w-sm p-5 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">{task.name}</h3>
                        <p className="mb-2"><strong>Proyecto:</strong> {task.project_name}</p>
                        <p className="mb-2"><strong>Descripción:</strong> {task.description}</p>
                        <p className="mb-2"><strong>Estado:</strong> {task.status_display}</p>
                        <p className="mb-2"><strong>Empleado encargado:</strong> {task.employee_name}</p>
                        <p className="mb-2"><strong>Fecha de inicio:</strong> {formatDate(task.start_date)}</p>
                        <p className="mb-2"><strong>Fecha de finalización:</strong> {task.finished_date ? formatDate(task.finished_date) : 'N/A'}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => openDetailsModal(task)} className="text-xl text-black-600 hover:text-blue-600">
                            <i className='bx bxs-edit-alt'></i>
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-xl text-black-600 hover:text-red-600">
                            <i className='bx bxs-trash-alt'></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
        <ProjectTaskDetails
            isOpen={isDetailsModalOpen}
            closeModal={closeDetailsModal}
            task={selectedTask}
            refreshTasks={fetchProjectAndTasks}
        />
        <ProjectTaskCreate
            isOpen={isModalOpen}
            closeModal={closeModal}
            refreshTasks={fetchProjectAndTasks}
            projectId={projectId}
            projectName={project ? project.name : ''}
        />
    </div>
  );
}

export default ProjectTasks;
