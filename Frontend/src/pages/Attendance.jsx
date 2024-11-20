import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/attendance.css';

const Attendance = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [grades, setGrades] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [typedText, setTypedText] = useState('');
    const message = "Asistencia";


    // Efecto de escribir en el título
    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < message.length) {
                setTypedText(message.substring(0, index + 1));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, []);

    // Obtener opciones para los dropdowns
    const fetchOptions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/options', { withCredentials: true });
            setClassrooms(response.data.classrooms);
            setGrades(response.data.grades);
            setInstitutions(response.data.institutions);
            setSchedules(response.data.schedules);
        } catch (error) {
            console.error('Error al obtener opciones:', error);
        }
    };

    // Obtener estudiantes filtrados
    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/students', {
                params: { classroom: selectedClassroom, grade: selectedGrade, institution: selectedInstitution, schedule: selectedSchedule, date: selectedDate },
                withCredentials: true,
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
        }
    };

    // Manejar cambio en los checkboxes
    const handleCheckboxChange = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    // Marcar asistencia en la tabla visualmente
    const markAttendance = (status) => {
        const updatedStudents = students.map((student) =>
            selectedStudents.includes(student.id) ? { ...student, status } : student
        );
        setStudents(updatedStudents);
    };

    // Enviar cambios a la base de datos
    // Función para enviar los cambios al backend
// Enviar cambios a la base de datos
const sendChanges = async () => {
    const updatedStatus = students
        .filter(student => selectedStudents.includes(student.id)) // Filtra solo los estudiantes seleccionados
        .map(student => ({
            id: student.id, // ID del estudiante
            status: student.status, // Estatus actual del estudiante
        }));

    if (updatedStatus.length === 0) {
        alert('Por favor selecciona al menos un estudiante antes de enviar los cambios.');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/update-attendance', {
            studentIds: updatedStatus.map(student => student.id), // Lista de IDs de estudiantes
            date: selectedDate, // Fecha seleccionada
            schedule: selectedSchedule, // Horario seleccionado
            status: updatedStatus[0]?.status || 'No asignado', // El estatus seleccionado
        });

        if (response.data.success) {
            alert('Cambios guardados exitosamente.');
            fetchStudents(); // Recargar los datos de los estudiantes
            setSelectedStudents([]); // Limpiar la selección
        } else {
            alert('Error al guardar los cambios.');
        }
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert('Error al guardar los cambios.');
    }
};


    useEffect(() => {
        fetchOptions();
    }, []);

    return (
        <div className="attendance-page">
            <h2 className="typewriter-text">{typedText}</h2>
            <div className="filters-container">
                <select onChange={(e) => setSelectedClassroom(e.target.value)}>
                    <option value="">Aula</option>
                    {classrooms.map((classroom) => (
                        <option key={classroom} value={classroom}>{classroom}</option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedGrade(e.target.value)}>
                    <option value="">Grado</option>
                    {grades.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedInstitution(e.target.value)}>
                    <option value="">Institución</option>
                    {institutions.map((institution) => (
                        <option key={institution} value={institution}>{institution}</option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedSchedule(e.target.value)}>
                    <option value="">Horario</option>
                    {schedules.map((schedule) => (
                        <option key={schedule} value={schedule}>{schedule}</option>
                    ))}
                </select>

                <input type="date" onChange={(e) => setSelectedDate(e.target.value)} placeholder="dd/mm/aaaa" />
                <button onClick={fetchStudents} className="btn-search">Buscar</button>
            </div>

            <div className="actions-container">
                <div className="left-buttons">
                    <button onClick={() => markAttendance('Asistió')} className="btn-action">Marcar Asistió</button>
                    <button onClick={() => markAttendance('No asistió')} className="btn-action">Marcar No Asistió</button>
                </div>
                <button onClick={sendChanges} className="btn-action right-button">Enviar Cambios</button>
            </div>


            <table className="students-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedStudents(students.map(student => student.id));
                                    } else {
                                        setSelectedStudents([]);
                                    }
                                }}
                                style={{ accentColor: '#4b0e8a' }}
                            />
                        </th>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Celular</th>
                        <th>Correo Electrónico</th>
                        <th>Estatus Actual</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => handleCheckboxChange(student.id)}
                                    style={{ accentColor: '#4b0e8a' }}
                                />
                            </td>
                            <td>{student.id}</td>
                            <td>{student.full_name}</td>
                            <td>{student.phone_number}</td>
                            <td>{student.email}</td>
                            <td>{student.status || 'No asignado'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;
