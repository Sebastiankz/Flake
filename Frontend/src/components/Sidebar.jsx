import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTh, FaHome, FaUserGraduate, FaClipboardList, FaBook, FaClock, FaSignOutAlt } from 'react-icons/fa';
import '../styles/sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <FaTh className="toggle-icon" onClick={toggleSidebar} />
            <ul className="sidebar-menu">
                <li className="menu-item">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaHome className={`menu-icon ${isOpen ? '' : 'hidden'}`} />
                        {isOpen && <span>Inicio</span>}
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/inscripcion" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaUserGraduate className={`menu-icon ${isOpen ? '' : 'hidden'}`} />
                        {isOpen && <span>Inscripción de estudiantes</span>}
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/asistencia" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaClipboardList className={`menu-icon ${isOpen ? '' : 'hidden'}`} />
                        {isOpen && <span>Toma de asistencia</span>}
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/notas" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaBook className={`menu-icon ${isOpen ? '' : 'hidden'}`} />
                        {isOpen && <span>Toma de notas</span>}
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/horario" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FaClock className={`menu-icon ${isOpen ? '' : 'hidden'}`} />
                        {isOpen && <span>Horario del tutor</span>}
                    </NavLink>
                </li>
            </ul>
            <div className="logout">
                <FaSignOutAlt className={`menu-icon ${isOpen ? '' : 'hidden'}`} />
                {isOpen && <span>Cerrar sesión</span>}
            </div>
        </div>
    );
};

export default Sidebar;
