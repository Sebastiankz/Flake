import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/attendance.css';

const Attendance = () => {
    const [institutions, setInstitutions] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [typedText, setTypedText] = useState('');
    const message = 'Asistencia';

    const idProfesor = 1; // Cambia esto según el ID del profesor actual

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

    // Obtener instituciones del profesor
    const fetchInstitutions = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/asistencia/instituciones/${idProfesor}`);
            setInstitutions(response.data);
        } catch (error) {
            console.error('Error al obtener instituciones:', error);
        }
    };

    // Obtener aulas del profesor para una institución seleccionada
    const fetchClassrooms = async () => {
        if (!selectedInstitution) return;
        try {
            const response = await axios.get(`http://localhost:5000/asistencia/aulas/${idProfesor}/${selectedInstitution}`);
            setClassrooms(response.data);
        } catch (error) {
            console.error('Error al obtener aulas:', error);
        }
    };

    // Obtener horarios para un aula seleccionada
    const fetchSchedules = async () => {
        if (!selectedClassroom) return;
        try {
            const response = await axios.get(`http://localhost:5000/asistencia/horarios/${selectedClassroom}`);
            setSchedules(response.data);
        } catch (error) {
            console.error('Error al obtener horarios:', error);
        }
    };

    // Obtener estudiantes para un horario seleccionado
    const fetchStudents = async () => {
        if (!selectedSchedule) return;
        try {
            const response = await axios.get(`http://localhost:5000/asistencia/estudiantes/${selectedSchedule}`);
            const aulaData = response.data.aula;
            const studentData = response.data.estudiantes.map(student => ({
                ...student,
                status: student.Asistencia?.estado || 'No asignado',
            }));
            setStudents(studentData);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
        }
    };

    // Manejar selección de estudiantes
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
            selectedStudents.includes(student.id_alumno) ? { ...student, status } : student
        );
        setStudents(updatedStudents);
    };

    // Enviar cambios de asistencia al backend
    const sendChanges = async () => {
        const updatedStatus = students
            .filter(student => selectedStudents.includes(student.id_alumno))
            .map(student => ({
                id: student.id_alumno,
                status: student.status,
            }));

        if (updatedStatus.length === 0) {
            alert('Por favor selecciona al menos un estudiante antes de enviar los cambios.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/update-attendance', {
                studentIds: updatedStatus.map(student => student.id),
                date: selectedDate,
                schedule: selectedSchedule,
                status: updatedStatus[0]?.status || 'No asignado',
            });

            if (response.data.success) {
                alert('Asistencia registrada exitosamente.');
                fetchStudents();
                setSelectedStudents([]);
            } else {
                alert('Error al registrar la asistencia.');
            }
        } catch (error) {
            console.error('Error al registrar la asistencia:', error);
            alert('Error al registrar la asistencia.');
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    useEffect(() => {
        fetchClassrooms();
    }, [selectedInstitution]);

    useEffect(() => {
        fetchSchedules();
    }, [selectedClassroom]);

    return (
        <div className="attendance-page">
            <h2 className="typewriter-text">{typedText}</h2>
            <div className="filters-container">
                <select onChange={(e) => setSelectedInstitution(e.target.value)}>
                    <option value="">Institución</option>
                    {institutions.map((institution) => (
                        <option key={institution.cod_DANE} value={institution.cod_DANE}>{institution.nombre}</option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedClassroom(e.target.value)}>
                    <option value="">Aula</option>
                    {classrooms.map((classroom) => (
                        <option key={classroom.id_aula} value={classroom.id_aula}>
                            {`${classroom.grad_num}° - Grupo ${classroom.num_grupo} (${classroom.jornada})`}
                        </option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedSchedule(e.target.value)}>
                    <option value="">Horario</option>
                    {schedules.map((schedule) => (
                        <option key={schedule.id_horario} value={schedule.id_horario}>
                            {`${schedule.dia_semana} ${schedule.hora_inicio} - ${schedule.hora_fin}`}
                        </option>
                    ))}
                </select>

                <input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
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
                                        setSelectedStudents(students.map(student => student.id_alumno));
                                    } else {
                                        setSelectedStudents([]);
                                    }
                                }}
                                style={{ accentColor: '#4b0e8a' }}
                            />
                        </th>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Primer Apellido</th>
                        <th>Estatus Actual</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id_alumno}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student.id_alumno)}
                                    onChange={() => handleCheckboxChange(student.id_alumno)}
                                    style={{ accentColor: '#4b0e8a' }}
                                />
                            </td>
                            <td>{student.id_alumno}</td>
                            <td>{student.nombre}</td>
                            <td>{student.primer_apellido}</td>
                            <td>{student.status || 'No asignado'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;
