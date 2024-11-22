import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/grades.css';

const Grades = () => {
    const [institutions, setInstitutions] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [typedText, setTypedText] = useState('');
    const message = "Toma de Notas";

    // Efecto de máquina de escribir
    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < message.length) {
                setTypedText((prev) => prev + message.charAt(index));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);
        return () => clearInterval(typingInterval);
    }, [message]);

    // Obtener instituciones del profesor
    const fetchInstitutions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/instituciones');
            setInstitutions(response.data);
        } catch (error) {
            console.error('Error al obtener instituciones:', error);
        }
    };

    // Obtener aulas asociadas a la institución seleccionada
    const fetchClassrooms = async () => {
        if (!selectedInstitution) return;
        try {
            const response = await axios.get(`http://localhost:5000/aulas/${selectedInstitution}`);
            setClassrooms(response.data);
        } catch (error) {
            console.error('Error al obtener aulas:', error);
        }
    };

    // Obtener horarios de un aula específica
    const fetchSchedules = async () => {
        if (!selectedClassroom) return;
        try {
            const response = await axios.get(`http://localhost:5000/horarios/${selectedClassroom}`);
            setSchedules(response.data);
        } catch (error) {
            console.error('Error al obtener horarios:', error);
        }
    };

    // Obtener estudiantes y sus evaluaciones para el horario seleccionado
    const fetchStudents = async () => {
        if (!selectedSchedule) return;
        try {
            const response = await axios.get(`http://localhost:5000/evaluaciones/${selectedSchedule}`);
            setStudents(response.data);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
        }
    };

    // Manejar cambios en las notas de los estudiantes
    const handleGradeChange = (id_alumno, grade) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.id_alumno === id_alumno ? { ...student, nota: grade } : student
            )
        );
    };

    // Guardar o actualizar evaluaciones en el backend
    const updateGrades = async () => {
        const evaluaciones = students.map((student) => ({
            id_alumno: student.id_alumno,
            nota: student.nota || 0, // Asegurarse de que la nota no esté vacía
        }));

        try {
            const response = await axios.post('http://localhost:5000/evaluaciones', {
                id_horario: selectedSchedule,
                evaluaciones,
            });
            if (response.status === 201) {
                alert('Notas guardadas exitosamente.');
            } else {
                alert('Error al guardar las notas.');
            }
        } catch (error) {
            console.error('Error al guardar las notas:', error);
            alert('Error al guardar las notas.');
        }
    };

    // Efectos para cargar datos dinámicamente
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
                        <option key={institution.cod_DANE} value={institution.cod_DANE}>
                            {institution.nombre}
                        </option>
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

                <button onClick={fetchStudents} className="btn-search">Buscar</button>
            </div>

            <div className="actions-container">
                <button onClick={updateGrades} className="btn-action">Guardar Cambios</button>
            </div>

            <table className="students-table">
                <thead>
                    <tr>
                        <th>ID Alumno</th>
                        <th>Nombre Completo</th>
                        <th>Correo</th>
                        <th>Celular</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id_alumno}>
                            <td>{student.id_alumno}</td>
                            <td>{`${student.prim_nom} ${student.seg_nom} ${student.prim_apell} ${student.seg_apell}`}</td>
                            <td>{student.correo}</td>
                            <td>{student.celular}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={student.nota || ''}
                                    onChange={(e) => handleGradeChange(student.id_alumno, e.target.value)}
                                    style={{ width: '60px', textAlign: 'center' }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Grades;
