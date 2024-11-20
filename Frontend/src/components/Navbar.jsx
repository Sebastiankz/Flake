import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/navbar.css';
import { FaSnowflake } from 'react-icons/fa';

const Navbar = () => {
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Función para cargar los datos del usuario desde el backend
    const loadUserData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user-info', { withCredentials: true });
            console.log('Respuesta del servidor:', response.data);

            if (response.data && response.data.username && response.data.role) {
                setUserName(response.data.username);
                setUserRole(response.data.role);
            } else {
                setUserName('No autenticado');
                setUserRole('Sin rol');
            }
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
            setUserName('Error');
            setUserRole('Error');
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        loadUserData();
    }, []);

    // Mostrar texto de carga mientras se obtienen los datos
    if (isLoading) {
        return (
            <header className="navbar">
                <div className="navbar-left">
                    <FaSnowflake className="logo-icon-large" />
                    <span className="logo-text">Flake</span>
                </div>
                <div className="navbar-right">
                    <div className="user-info">
                        <span className="user-name">Cargando...</span>
                        <span className="user-role">Cargando...</span>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="navbar">
            <div className="navbar-left">
                <FaSnowflake className="logo-icon-large" />
                <span className="logo-text">Flake</span>
            </div>
            <div className="navbar-right">
                <div className="user-info">
                    <span className="user-name">{userName || 'Usuario'}</span>
                    <span className="user-role">{userRole || 'Rol'}</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
