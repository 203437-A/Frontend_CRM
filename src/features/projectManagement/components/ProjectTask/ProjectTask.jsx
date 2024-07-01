import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './projectTask.module.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
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
      await axios.delete(`/tasks/${id}/`);
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
    <div className='home'>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h2 className='title-container'>
        Tareas del Proyecto {project ? project.name : ''}
      </h2>
      <div className={styles.filterContainer}>
        <span>FILTROS</span>
        <input 
          type="text" 
          name="taskName" 
          placeholder="Buscar por nombre de la tarea..." 
          value={filters.taskName} 
          onChange={handleFilterChange} 
        />
        <input 
          type="text" 
          name="employee" 
          placeholder="Buscar por empleado encargado..." 
          value={filters.employee} 
          onChange={handleFilterChange} 
        />
        <select 
          name="taskStatus" 
          value={filters.taskStatus} 
          onChange={handleFilterChange}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En progreso</option>
          <option value="completada">Completada</option>
        </select>
      </div>
      <table className={styles.styledTable}>
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Nombre de la Tarea</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Empleado encargado</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de finalización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task.id}>
              <td data-tooltip-id="task-tooltip" data-tooltip-content={task.project_name}>{task.project_name}</td>
              <td data-tooltip-id="task-tooltip" data-tooltip-content={task.name}>{task.name}</td>
              <td data-tooltip-id="task-tooltip" data-tooltip-content={task.description}>{task.description}</td>
              <td>{task.status_display}</td>
              <td>{task.employee_name}</td>
              <td data-tooltip-id="task-tooltip" data-tooltip-content={formatDate(task.start_date)}>{formatDate(task.start_date)}</td>
              <td data-tooltip-id="task-tooltip" data-tooltip-content={formatDate(task.finished_date)}>{task.finished_date ? formatDate(task.finished_date) : 'N/A'}</td>
              <td>
                <button onClick={() => openDetailsModal(task)} className={styles.iconBtn}>
                  <i className='bx bxs-edit-alt edit'></i>
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className={styles.iconBtn}>
                  <i className='bx bxs-trash-alt delete'></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactTooltip id="task-tooltip" multiline={true} effect="solid"/>
      <div className={styles.buttonContainer}>
        <button className={styles.createButton} onClick={goToCategories}>Regresar a Proyectos</button>
        <button className={styles.createButton} onClick={openModal}>Crear tarea</button>
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
