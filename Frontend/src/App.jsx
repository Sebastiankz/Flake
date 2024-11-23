import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './pages/Home';
import Enrollment from './pages/Enrollment';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Schedule from './pages/Schedule';
import Rooms from './pages/Rooms';
import AdmEstudiantes from './pages/AdmEstudiantes';
import AdmPersonal from './pages/AdmPersonal';
import AdmAsistencia from './pages/AdmAsistencia';
import AdmAulas from './pages/AdmAulas';
import AdmHorarios from './pages/AdmHorarios';
import AdmInstituciones from './pages/AdmInstituciones';
import AdmNotas from './pages/AdmNotas';
import AdmTutores from './pages/AdmTutores';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const role = localStorage.getItem('role'); // Obtener el rol del usuario

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
    };

    return (
        <div className="app">
            {isAuthenticated ? (
                <>
                    <Navbar />
                    <div className="main-container">
                        <Sidebar handleLogout={handleLogout} />
                        <div className="content-container">
                            <Routes>
                                <Route path="/inicio" element={<Home />} />
                                {role === 'instructor' && (
                                    <>
                                        <Route path="/asistencia" element={<Attendance />} />
                                        <Route path="/notas" element={<Grades />} />
                                        <Route path="/horario" element={<Schedule />} />
                                        <Route path="/aulas" element={<Rooms />} />
                                    </>
                                )}
                                {role === 'admin' && (
                                    <>
                                        <Route path="/admEstudiantes" element={<AdmEstudiantes />} />
                                        <Route path="/admPersonal" element={<AdmPersonal />} />
                                        <Route path="/admAulas" element={<AdmAulas />} />
                                        <Route path="/admHorarios" element={<AdmHorarios />} />
                                        <Route path="/admInstituciones" element={<AdmInstituciones />} />
                                        <Route path="/admAsistencia" element={<AdmAsistencia />} />
                                        <Route path="/admNotas" element={<AdmNotas />} />
                                        <Route path="/admTutores" element={<AdmTutores />} />
                                        <Route path="/inscripcion" element={<Enrollment />} />
                                    </>
                                )}
                                <Route path="*" element={<Navigate to="/inicio" />} />
                            </Routes>
                        </div>
                    </div>
                    <Footer />
                </>
            ) : (
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </div>
    );
};

export default App;
