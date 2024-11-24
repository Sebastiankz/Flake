import React, { useEffect, useState } from 'react';
import '../styles/home.css';

const Home = () => {
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const message = 'Bienvenido';

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
