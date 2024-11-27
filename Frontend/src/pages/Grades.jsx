import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/grades.css';

const Grades = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [grades, setGrades] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [students, setStudents] = useState([]);
    const [typedText, setTypedText] = useState(''); // Solución del error

    const message = "Notas";

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

    const fetchOptions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/options', { withCredentials: true });
            setClassrooms(response.data.classrooms);
            setGrades(response.data.grades);
            setInstitutions(response.data.institutions);
        } catch (error) {
            console.error('Error al obtener opciones:', error);
        }
    };

    const fetchStudents = async () => {
        if (!selectedClassroom || !selectedGrade || !selectedInstitution || !selectedDate) {
            alert('Por favor selecciona todos los filtros antes de buscar.');
            return;
        }
        try {
            const response = await axios.get('http://localhost:5000/students', {
                params: { 
                    classroom: selectedClassroom, 
                    grade: selectedGrade, 
                    institution: selectedInstitution,
                    date: selectedDate,
                },
                withCredentials: true,
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
        }
    };
    

    const updateGrades = async () => {
        const updatedGrades = students
            .filter(student => student.id) // Asegúrate de que haya un ID válido
            .map(student => ({
                id: student.id,
                grade: student.grade,
            }));
    
        if (updatedGrades.length === 0) {
            alert('No hay notas válidas para actualizar.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/update-grades', {
                grades: updatedGrades,
                date: selectedDate,
            });
            if (response.data.success) {
                alert('Notas guardadas exitosamente.');
            } else {
                alert('Error al guardar las notas.');
            }
        } catch (error) {
            console.error('Error al guardar las notas:', error);
            alert('Error al guardar las notas.');
        }
    };
    

    const handleGradeChange = (id, grade) => {
        setStudents(students.map(student =>
            student.id === id ? { ...student, grade } : student
        ));
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
                <input type="date" onChange={(e) => setSelectedDate(e.target.value)} placeholder="dd/mm/aaaa" />
                <button onClick={fetchStudents} className="btn-search">Buscar</button>
            </div>

            <div className="actions-container">
                <button onClick={updateGrades} className="btn-action" style={{ float: 'right' }}>Guardar Cambios</button>
            </div>

            <table className="students-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Celular</th>
                        <th>Correo Electrónico</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.full_name}</td>
                            <td>{student.phone_number}</td>
                            <td>{student.email}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={student.grade || ''}
                                    onChange={(e) => handleGradeChange(student.id, e.target.value)}
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
