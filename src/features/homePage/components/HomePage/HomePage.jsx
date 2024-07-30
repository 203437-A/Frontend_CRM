import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';

const HomePage = () => {
  const [user, setUser] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [devices, setDevices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recentClients, setRecentClients] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;
      const response = await axios.get(`/employees/${userId}`);
      setUser(response.data);
    };

    const fetchDevices = async () => {
      try {
        const response = await axios.get('/devices/');
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
        toast.error('Error al cargar los dispositivos.');
      }
    };

    const fetchProjects = async () => {
      const response = await axios.get('/projects');
      setProjects(response.data);
    };

    const fetchRecentClients = async () => {
      const response = await axios.get('/clients');
      setRecentClients(response.data.slice(0, 5));
    };

    fetchUserData();
    fetchDevices();
    fetchProjects();
    fetchRecentClients();

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home p-5">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover draggable />

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-gray-900 text-white p-5 rounded-lg shadow-md flex-1 flex flex-col">
          <div className="flex items-center mb-4">
            <div className="ml-4">
              <h2 className="text-xl font-bold">UMBRELLA BITS</h2>
              <p className="text-lg">Fecha y hora: {format(currentDateTime, 'PPpp')}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 text-white p-5 rounded-lg shadow-md w-64 flex-shrink-0 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">Bienvenido</h2>
          <p className="text-lg">{user.first_name}!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Estado de Dispositivos</h2>
          <ul>
            {devices.map((device, index) => (
              <li key={index} className="mb-1">
                <span className="font-bold">{device.name}</span>: 
                {device.device_status === 'reparado' ? ' Reparado' :
                device.device_status === 'en_reparacion' ? ' No Reparado' :
                device.device_status === 'entregado' ? ' Entregado' :
                'Estado Desconocido'}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Proyectos en Curso</h2>
          <ul>
            {projects.map((project, index) => (
              <li key={index} className="mb-1">
                {project.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Clientes Recientes</h2>
          <ul>
            {recentClients.map((client, index) => (
              <li key={index} className="mb-1">
                {client.first_name} {client.last_name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
