import React from 'react';
import { FaSnowflake } from 'react-icons/fa';
import '../styles/navbar.css';

const Navbar = () => {
    const fullName = localStorage.getItem('full_name'); // Obtener full_name
    const username = localStorage.getItem('username'); // Obtener username
    const userRole = localStorage.getItem('role'); // Obtener role

    return (
        <header className="navbar">
            <div className="navbar-left">
                <FaSnowflake className="logo-icon-large" />
                <span className="logo-text">Flake</span>
            </div>
            <div className="navbar-right">
                <div className="user-info">
                    <span className="user-name">{fullName !== 'undefined' ? fullName : (username !== 'undefined' ? username : 'Usuario')}</span>
                    <span className="user-role">
                        {userRole === 'admin' ? 'Administrador' : 'Instructor'}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
