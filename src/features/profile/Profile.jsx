import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import styles from './profile.module.css';

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
                const response = await axios.get(`http://localhost:8000/api/employees/${user_id}`);
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
        <div className='home'>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover draggable />
            <h2 className='title-container'>Perfil</h2> 
            <div className={styles.formProfileChilds}> 
                <form onSubmit={handleSubmit} className={styles.formProfile}> 
                    <label>
                        Usuario
                        <input type="text" value={user.username} onChange={handleChange} name="username" required />
                    </label>
                    <label>
                        Nombre
                        <input type="text" value={user.first_name} onChange={handleChange} name="first_name" required />
                    </label>
                    <label>
                        Apellido
                        <input type="text" value={user.last_name} onChange={handleChange} name="last_name" required />
                    </label>
                    <label>
                        Correo
                        <input type="email" value={user.email} onChange={handleChange} name="email" required />
                    </label>
                    <label>
                        Teléfono
                        <input type="text" value={user.phone_number} onChange={handleChange} name="phone_number" required pattern="^\d{1,13}$" title="El número de teléfono debe contener hasta 13 dígitos." />
                    </label>
                    {error && <p className={styles.formProfileError}>{error}</p>} 
                    <div className={styles.buttonsContainerProfile}> 
                        <button type="submit">Salvar datos</button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default Profile;
