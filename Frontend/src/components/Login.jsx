import React, { useState, useEffect } from 'react';
import { FaSnowflake, FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('instructor');
    const [typedText, setTypedText] = useState('');
    const navigate = useNavigate();
    const message = "Nos alegra verte de nuevo 👋";

    // Efecto de máquina de escribir
    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < message.length) {
                setTypedText(message.substring(0, index + 1));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, []);

    // Manejo del formulario de inicio de sesión
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: username.trim(),
                password: password.trim(),
                role,
            });
    
            if (response.data.success) {
                const { username, full_name, role } = response.data.user;
                localStorage.setItem('username', username || 'Desconocido');
                localStorage.setItem('full_name', full_name || 'Desconocido');
                localStorage.setItem('role', role || '');
                onLogin(); // Cambia el estado de autenticación en App.jsx
                navigate('/inicio', { replace: true }); // Redirige a la página de inicio
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error en el servidor');
        }
    };

    return (
        <div className="login-background">
            <FaQuestionCircle className="help-icon" title="Ayuda" />
            <div className="login-container">
                <div className="login-card">
                    <FaSnowflake className="logo-icon" />
                    <h2>¡Bienvenido!</h2>
                    <p className="typewriter-text">{typedText}</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="role-selection">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="role"
                                    value="instructor"
                                    checked={role === 'instructor'}
                                    onChange={() => setRole('instructor')}
                                />
                                Instructor
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={() => setRole('admin')}
                                />
                                Administrador
                            </label>
                        </div>
                        <button type="submit" className="btn btn-morado btn-large">
                            Iniciar sesión
                        </button>
                        <div className="footer-logos">
                            <img src="/assets/logos/unLogo.png" alt="Universidad del Norte" className="footer-logo" />
                            <img src="/assets/logos/britishCouncilLogo.png" alt="British Council" className="footer-logo" />
                            <img src="/assets/logos/alcaldiaLogo.png" alt="Alcaldía de Barranquilla" className="footer-logo" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
