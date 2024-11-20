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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const userName = "Nombre Usuario";
    const userRole = "Instructor";

    // Función para manejar el inicio de sesión
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <div className="app">
            {isAuthenticated ? (
                <>
                    <Navbar userName={userName} userRole={userRole} />
                    <div className="main-container">
                        <Sidebar />
                        <div className="content-container">
                        <Routes>
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/inicio" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                            <Route path="/inscripcion" element={isAuthenticated ? <Inscripcion /> : <Navigate to="/login" />} />
                            <Route path="/asistencia" element={isAuthenticated ? <Asistencia /> : <Navigate to="/login" />} />
                            <Route path="/notas" element={isAuthenticated ? <Notas /> : <Navigate to="/login" />} />
                            <Route path="/horario" element={isAuthenticated ? <Horario /> : <Navigate to="/login" />} />
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
