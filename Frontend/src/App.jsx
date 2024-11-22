import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './pages/Home';
import Inscripcion from './pages/Enrollment';
import Asistencia from './pages/Attendance';
import Notas from './pages/Grades';
import Horario from './pages/Schedule';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('username') // Verificar si hay usuario almacenado
    );

    // Función para manejar el inicio de sesión
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.clear(); // Limpiar datos almacenados
        setIsAuthenticated(false); // Actualizar estado de autenticación
    };

    return (
        <div className="app">
            {isAuthenticated ? (
                <>
                    <Navbar
                        userName={localStorage.getItem('username')}
                        userRole={localStorage.getItem('role')}
                        onLogout={handleLogout} // Pasar la función de logout (si se requiere en Navbar)
                    />
                    <div className="main-container">
                        <Sidebar handleLogout={handleLogout} /> {/* Pasar handleLogout al Sidebar */}
                        <div className="content-container">
                            <Routes>
                                <Route path="/inicio" element={<Home />} />
                                <Route path="/inscripcion" element={<Inscripcion />} />
                                <Route path="/asistencia" element={<Asistencia />} />
                                <Route path="/notas" element={<Notas />} />
                                <Route path="/horario" element={<Horario />} />
                                <Route path="*" element={<Navigate to="/inicio" />} />
                            </Routes>
                        </div>
                    </div>
                    <Footer />
                </>
            ) : (
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                </Routes>
            )}
        </div>
    );
};

export default App;
