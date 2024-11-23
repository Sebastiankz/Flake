import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaTh,
    FaHome,
    FaUserGraduate,
    FaClipboardList,
    FaBook,
    FaClock,
    FaSignOutAlt,
    FaUsers,
    FaBuilding,
    FaUserTie,
    FaSchool,
    FaChalkboardTeacher,
} from 'react-icons/fa';
import '../styles/sidebar.css';

const Sidebar = ({ handleLogout }) => {
    const [isOpen, setIsOpen] = useState(true);
    const role = localStorage.getItem('role'); // Obtenemos el rol del usuario

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Opciones para instructor
    const instructorOptions = [
        { path: '/inicio', label: 'Inicio', icon: <FaHome /> },
        { path: '/asistencia', label: 'Asistencia', icon: <FaClipboardList /> },
        { path: '/notas', label: 'Notas', icon: <FaBook /> },
        { path: '/horario', label: 'Horario', icon: <FaClock /> },
        { path: '/aulas', label: 'Aulas', icon: <FaSchool /> },

    ];

    // Opciones para administrador
    const adminOptions = [
        { path: '/inicio', label: 'Inicio', icon: <FaHome /> },
        { path: '/admPersonal', label: 'Personal', icon: <FaUserTie /> },
        { path: '/admEstudiantes', label: 'Estudiantes', icon: <FaUserGraduate /> },
        { path: '/admInstituciones', label: 'Instituciones', icon: <FaUsers /> },
        { path: '/admAulas', label: 'Aulas', icon: <FaBuilding /> },
        { path: '/admAsistencia', label: 'Asistencia', icon: <FaClipboardList /> },
        { path: '/admNotas', label: 'Notas', icon: <FaBook /> },
        { path: '/admTutores', label: 'Tutores', icon: <FaChalkboardTeacher /> },
        { path: '/admHorarios', label: 'Horarios', icon: <FaClock /> },
    ];

    // Determinar qué opciones mostrar según el rol
    const menuOptions = role === 'admin' ? adminOptions : instructorOptions;

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <FaTh className="toggle-icon" onClick={toggleSidebar} />
            <ul className="sidebar-menu">
                {menuOptions.map((option, index) => (
                    <li key={index} className="menu-item">
                        <NavLink to={option.path} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                            {React.cloneElement(option.icon, {
                                className: `menu-icon ${isOpen ? '' : 'hidden'}`,
                            })}
                            {isOpen && <span>{option.label}</span>}
                        </NavLink>
                    </li>
                ))}
                <li className="menu-item">
                    <NavLink to="/login" onClick={handleLogout} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        <FaSignOutAlt className={`menu-icon ${isOpen ? '' : 'hidden'}`} />
                        {isOpen && <span>Cerrar sesión</span>}
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
