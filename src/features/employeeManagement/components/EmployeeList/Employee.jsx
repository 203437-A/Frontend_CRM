import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './employee.module.css';
import EmployeeDetails from '../EmployeeDetails/EmployeeDetails'; 
import EmployeeCreate from '../EmployeeCreate/EmployeeCreate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'

export default function Employee() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [filter, setFilter] = useState("");
    const [isStaffFilter, setIsStaffFilter] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [nonAdminFilter, setNonAdminFilter] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        filterEmployees();
    }, [employees, filter, isStaffFilter, nonAdminFilter]);

    //
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/employees/'); 
            setEmployees(response.data);
            console.log(response);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };
    

    const handleDeleteEmployee = async (id) => {
        try {
            await axios.delete(`/employees/${id}/`);
            fetchEmployees(); 
            toast.success('Empleado eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting employee:', error);
            if (error.response && error.response.status === 403) {
                toast.error('No tienes permiso para eliminar este empleado.');
            } else {
                toast.error('Error al eliminar empleado');
            }
        }
    };
    
    // const handleSelectEmployee = (employee) => {
    //     setSelectedEmployee(employee);
    // };

    //FILTROS
    const filterEmployees = () => {
        let tempEmployees = employees.filter(emp =>
            emp.first_name.toLowerCase().includes(filter.toLowerCase()) ||
            emp.last_name.toLowerCase().includes(filter.toLowerCase())
        );
    
        if (isStaffFilter) {
            tempEmployees = tempEmployees.filter(emp => emp.is_staff);
        }
        if (nonAdminFilter) {
            tempEmployees = tempEmployees.filter(emp => !emp.is_staff);
        }
    
        setFilteredEmployees(tempEmployees);
    };
    
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleIsStaffChange = (e) => {
        setIsStaffFilter(e.target.checked);
        if (e.target.checked) {
            setNonAdminFilter(false);
        }
    };
    
    const handleNonAdminChange = (e) => {
        setNonAdminFilter(e.target.checked);
        if (e.target.checked) {
            setIsStaffFilter(false);
        }
    };
    
    //NUEVO
    const openDetailsModal = (employee) => {
        setSelectedEmployee(employee);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
    };
    //FIN

    return (
        <div className='home'>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className='title-container'>Empleados</h2>
            <div className={styles.filterContainer}>
                <span>FILTROS</span>
                <input type="text" placeholder="Buscar por nombre..." value={filter} onChange={handleFilterChange} />
                <label>
                    <input type="checkbox" checked={isStaffFilter} onChange={handleIsStaffChange} />
                    Solo administradores
                </label>
                <label>
                    <input type="checkbox" checked={nonAdminFilter} onChange={handleNonAdminChange} />
                    Solo empleados
                </label>
            </div>
            <table className={styles.styledTable}>
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>¿Es administrador?</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map(employee => (
                        <tr key={employee.id} className={employee.is_staff ? styles.adminRow : ""}>
                            <td>{employee.username}</td>
                            <td>{employee.first_name}</td>
                            <td>{employee.last_name}</td>
                            <td data-tooltip-id="email-tooltip" data-tooltip-content={employee.email}>{employee.email}</td>
                            <td>{employee.phone_number}</td>
                            <td>{employee.is_staff ? "Sí" : "No"}</td>
                            <td>
                                <button onClick={() => openDetailsModal(employee)} className={styles.iconBtn}>
                                    <i className='bx bxs-edit-alt edit'></i>
                                </button>
                                <button onClick={() => handleDeleteEmployee(employee.id)} className={styles.iconBtn}>
                                    <i className='bx bxs-trash-alt delete' ></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactTooltip id="email-tooltip" />
            <EmployeeDetails
                isOpen={isDetailsModalOpen}
                closeModal={closeDetailsModal}
                employee={selectedEmployee}
                refreshEmployees={fetchEmployees}
            />
            <button className={styles.createButton} onClick={openModal}>Crear Empleado</button>
            <EmployeeCreate
                isOpen={isModalOpen}
                closeModal={closeModal}
                refreshEmployees={fetchEmployees}
            />
        </div>
      );
}

