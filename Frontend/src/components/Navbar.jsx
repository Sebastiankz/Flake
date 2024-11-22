import React from 'react';
import { FaSnowflake } from 'react-icons/fa';
import '../styles/navbar.css';

const Navbar = () => {
    const fullName = localStorage.getItem('full_name');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('role'); // 1 para Admin, 2 para Profesor

    // Determinar el rol del usuario basado en el valor de `role`
    const roleName = userRole === '1' ? 'Administrador' : userRole === '2' ? 'Profesor' : 'Usuario';

    return (
        <header className="navbar">
            <div className="navbar-left">
                <FaSnowflake className="logo-icon-large" />
                <span className="logo-text">Flake</span>
            </div>
            <div className="navbar-right">
                <div className="user-info">
                    <span className="user-name">{fullName || username || 'Usuario'}</span>
                    <span className="user-role">{roleName}</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
