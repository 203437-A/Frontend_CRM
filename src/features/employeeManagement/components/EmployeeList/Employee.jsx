import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        <div className="home p-5">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">Empleados</h2>
            <div className="mb-5 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-700">FILTROS</span>
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={filter}
                    onChange={handleFilterChange}
                    className="flex-grow p-2 border border-gray-300 rounded"
                />
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={isStaffFilter} onChange={handleIsStaffChange} className="form-checkbox" />
                    Solo administradores
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={nonAdminFilter} onChange={handleNonAdminChange} className="form-checkbox" />
                    Solo empleados
                </label>
            </div>
            <div className="mb-5 flex justify-center gap-2">
               <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={openModal}>Crear Empleado</button>
            </div>
            <div className="flex flex-wrap gap-5 justify-center">
                {filteredEmployees.map(employee => (
                    <div key={employee.id} className={`relative bg-white rounded shadow-md w-full max-w-sm p-5 flex flex-col justify-between`}>
                        {employee.is_staff && (
                            <div className="absolute top-2 right-2 text-green-500">
                                <i className="bx bx-check-circle text-2xl"></i>
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-bold mb-2">{employee.username}</h3>
                            <p className="mb-2"><strong>Nombre:</strong> {employee.first_name}</p>
                            <p className="mb-2"><strong>Apellido:</strong> {employee.last_name}</p>
                            <p className="mb-2" ><strong>Correo:</strong> {employee.email}</p>
                            <p className="mb-2"><strong>Teléfono:</strong> {employee.phone_number}</p>
                            <p className="mb-2"><strong>¿Es administrador?:</strong> {employee.is_staff ? "Sí" : "No"}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <button onClick={() => openDetailsModal(employee)} className="text-xl text-black hover:text-blue-600">
                                <i className='bx bxs-edit-alt'></i>
                            </button>
                            <button onClick={() => handleDeleteEmployee(employee.id)} className="text-xl text-black hover:text-red-600">
                                <i className='bx bxs-trash-alt'></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <EmployeeDetails
                isOpen={isDetailsModalOpen}
                closeModal={closeDetailsModal}
                employee={selectedEmployee}
                refreshEmployees={fetchEmployees}
            />
            <EmployeeCreate
                isOpen={isModalOpen}
                closeModal={closeModal}
                refreshEmployees={fetchEmployees}
            />
        </div>
    );
}

