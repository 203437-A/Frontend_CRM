import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './login.module.css';  
import { useAuth } from '../../contexts/AuthContext'; 

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/login/', { username, password });
            login(response.data);
            toast.success("Inicio de sesión exitoso. Bienvenido!");
            setTimeout(() => { 
                navigate('/home/');
            }, 1000);
        } catch (error) {
            console.error('Error de inicio de sesión:', error);
            toast.error("Error al iniciar sesión, por favor revise sus credenciales e intente de nuevo.");
        }
    };

    return (
        <div className={styles.bodyContainerLogin}>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover draggable />
            <div className={styles.containerForm}> 
                <div className={styles.information}> 
                    <div className={styles.infoChilds}> 
                        <h2>Bienvenido</h2>
                        <p>Inicie sesión para poder acceder al sistema de Soporte</p>
                    </div>
                </div>
                <div className={styles.formInformation}> 
                    <div className={styles.formInformationChilds}> 
                        <h2>Inicio de sesión</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <label>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAR5JREFUSEvVlF0OATEUhe/shJVgJ6wEK8FKsBJ2wnzJbdKp256GzIMmHkzT8537O9jMZ5hZ33oBCzM7mdnazJ7+O47/b8pgD2Dr4qUWoMv48dCCKACOry6AY8SIBujeI9m1IlEA0oJYEs/NpshI06YWhQI83PHS3eY6RMI9qeI+PL8AEHy5alVHAcg/dYhSRD2ow9nMqMNXEeRpSB2TFxlR8l9tVxUBAslp5BDnRFA9PQAezzpoalib9yoC0rPyQkeTTIveW9NcA9A5DBmp6TmAwomOAPl6qD50OAZoVd6EHRUB0vQ2+zsLq9xNk6kuAV37JchZ3mWToSwBabnJ/g4gKbWT5VcCWstNFTtcfiVALi9B+Xiv5kC5lvf/D3gDooFEGQmY59EAAAAASUVORK5CYII="/>
                                <input type="text" placeholder="Nombre del usuario" onChange={e => setUsername(e.target.value)} required />
                            </label>
                            <label>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAANJJREFUSEvtlcsNwjAQRCedQCdQCVAJUAl0Ap1AJ8CTNlIQ60wcFMEhviSW7Xn7tRtNPJqJ9TUUsJK0kcSXcZd0fM2vzsAhgK2kU0EIyKEP4gBYfAkBxM7xDxSPFpKW4VHKcQDEgWSWYvk+oLuSFw7wiIPZPqy/hfV4McqDPgCCbt1WkRNw678BkFSS19a8K/V2nZ746I0seSSOBI4ZQNbdgxnAxrVATs/NgG605hDZqv2fEH3TaLx0bzdr1gdcEbxgtd08+Kqwwa7Z4B6cGq107xN01TAZyGBvqwAAAABJRU5ErkJggg=="/>
                                <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} required />
                            </label>
                            <button type="submit">Iniciar</button>
                            <div className={styles.alerta}>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
