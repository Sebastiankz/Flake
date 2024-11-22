import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaClipboardList, FaBook, FaClock } from 'react-icons/fa';
import '../styles/home.css';

const Home = () => {
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
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

    const imagePaths = [
        '/assets/carrusel/img1.jpg',
        '/assets/carrusel/img2.jpg',
        '/assets/carrusel/img3.jpg',
        '/assets/carrusel/img4.jpg',
        '/assets/carrusel/img5.jpg',
        '/assets/carrusel/img6.jpg',
        '/assets/carrusel/img7.jpg',
        '/assets/carrusel/img8.jpg',
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="home-container aligned">
            <div className="header-section">
                <h1 className="title-text">{typedText}{showCursor && <span className="cursor">|</span>}</h1>
                <p className="subtitle-text">Nos alegra tenerte aquí. Selecciona una opción para continuar.</p>
                <div className="logos-container">
                    <img src="/assets/logos/unLogo.png" alt="Universidad del Norte" className="home-logo" />
                    <img src="/assets/logos/britishCouncilLogo.png" alt="British Council" className="home-logo" />
                    <img src="/assets/logos/alcaldiaLogo.png" alt="Alcaldía de Barranquilla" className="home-logo" />
                </div>
            </div>

            <div className="buttons-container aligned">
                <button className="rect-button" onClick={() => handleNavigation('/inscripcion')}>
                    <FaUserGraduate className="button-icon" /> Inscripción de estudiantes
                </button>
                <button className="rect-button" onClick={() => handleNavigation('/asistencia')}>
                    <FaClipboardList className="button-icon" /> Toma de asistencia
                </button>
                <button className="rect-button" onClick={() => handleNavigation('/notas')}>
                    <FaBook className="button-icon" /> Toma de notas
                </button>
                <button className="rect-button" onClick={() => handleNavigation('/horario')}>
                    <FaClock className="button-icon" /> Horario del tutor
                </button>
            </div>

            <div className="carousel-container aligned">
                <div className="carousel-track auto-slide">
                    {imagePaths.map((path, index) => (
                        <img key={index} src={path} alt={`Slide ${index + 1}`} className="carousel-image large-carousel-image" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
