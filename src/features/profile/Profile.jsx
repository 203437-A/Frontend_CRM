import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const [user, setUser] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');
        if (!user_id) {
            toast.error("ID de usuario no disponible.");
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/employees/${user_id}`);
                setUser({
                    username: response.data.username,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: response.data.email,
                    phone_number: response.data.phone_number
                });
            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
                toast.error('Error al cargar datos del perfil.');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone_number' && (!/^\d*$/.test(value) || value.length > 13)) {
            setError("El teléfono debe contener solo hasta 13 dígitos.");
            return;
        }
        setError('');
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user_id = localStorage.getItem('user_id');
        try {
            const response = await axios.put(`/employees/${user_id}/`, user);
            const dataToSave = {
                username: response.data.username,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                email: response.data.email,
                phone_number: response.data.phone_number
            };
            Object.entries(dataToSave).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
            setUser(dataToSave); 
            toast.success('Datos actualizados correctamente.');
        } catch (error) {
            console.error("Error al actualizar los datos:", error);
            toast.error('Error al guardar los datos.');
        }
    };
    
    return (
        <div className="home p-5">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover draggable />
            <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">Perfil</h2>
            <div className="w-full mx-auto p-6">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div>
                        <label className="block font-bold text-gray-700">Usuario</label>
                        <input type="text" value={user.username} onChange={handleChange} name="username" required className="w-full mt-1 p-2 border border-gray-300 rounded" />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700">Nombre</label>
                        <input type="text" value={user.first_name} onChange={handleChange} name="first_name" required className="w-full mt-1 p-2 border border-gray-300 rounded" />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700">Apellido</label>
                        <input type="text" value={user.last_name} onChange={handleChange} name="last_name" required className="w-full mt-1 p-2 border border-gray-300 rounded" />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700">Correo</label>
                        <input type="email" value={user.email} onChange={handleChange} name="email" required className="w-full mt-1 p-2 border border-gray-300 rounded" />
                    </div>

                    <div>
                        <label className="block font-bold text-gray-700">Teléfono</label>
                        <input type="text" value={user.phone_number} onChange={handleChange} name="phone_number" required pattern="^\d{1,13}$" title="El número de teléfono debe contener hasta 13 dígitos." className="w-full mt-1 p-2 border border-gray-300 rounded" />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-center mt-4">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800">Salvar datos</button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default Profile;
