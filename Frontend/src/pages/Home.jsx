import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/home.css';

const Home = () => {
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const message = 'Bienvenido';
    const navigate = useNavigate();

    // Efecto de máquina de escribir
    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < message.length) {
                setTypedText(message.substring(0, index + 1));
                index++;
            } else {
                clearInterval(typingInterval);
                setShowCursor(false); // Ocultar el cursor al finalizar
            }
        }, 150);

        return () => clearInterval(typingInterval);
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });

            if (response.data.success) {
                // Guardar el token o los datos del usuario en localStorage/sessionStorage si es necesario
                navigate('/dashboard'); // Redirigir al dashboard tras el login
            } else {
                setErrorMessage(response.data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en el login:', error);
            setErrorMessage('Error al iniciar sesión. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="home-container aligned">
            <div className="header-section">
                <h1 className="title-text">{typedText}{showCursor && <span className="cursor">|</span>}</h1>
                <p className="subtitle-text">Por favor, inicia sesión para continuar.</p>
                <div className="login-container">
                    <div className="login-inputs">
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button className="login-button" onClick={handleLogin}>
                        Iniciar sesión
                    </button>
                </div>
            </div>

            <div className="logos-container">
                <img src="/assets/logos/unLogo.png" alt="Universidad del Norte" className="home-logo" />
                <img src="/assets/logos/britishCouncilLogo.png" alt="British Council" className="home-logo" />
                <img src="/assets/logos/alcaldiaLogo.png" alt="Alcaldía de Barranquilla" className="home-logo" />
            </div>
        </div>
    );
};

export default Home;
