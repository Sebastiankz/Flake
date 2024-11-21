import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/enrollment.css';

const Enrollment = () => {
    const [dropdownOptions, setDropdownOptions] = useState({
        grades: [],
        institutions: [],
        classrooms: [],
        schedules: [],
    });
    const [students, setStudents] = useState([]);
    const [selectedDropdowns, setSelectedDropdowns] = useState({
        grade: '',
        institution: '',
        classroom: '',
        schedule: '',
    });
    const [typedText, setTypedText] = useState('');
    const message = "iInscripciones";

    // Efecto de máquina de escribir para el título
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

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/options');
                setDropdownOptions(response.data);
            } catch (error) {
                console.error('Error al obtener opciones:', error);
            }
        };
        fetchOptions();
    }, []);

    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        setSelectedDropdowns((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);
    };

    const addRow = () => {
        setStudents([...students, { fullName: '', phoneNumber: '', email: '' }]);
    };

    const removeRow = (index) => {
        const updatedStudents = [...students];
        updatedStudents.splice(index, 1);
        setStudents(updatedStudents);
    };

    const addStudents = async () => {
        if (!selectedDropdowns.grade || !selectedDropdowns.institution || !selectedDropdowns.classroom || !selectedDropdowns.schedule) {
            alert('Por favor, selecciona todos los campos de los dropdowns.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/add-students', {
                students: students.map((student) => ({
                    fullName: student.fullName.trim(),
                    phoneNumber: student.phoneNumber.trim(),
                    email: student.email.trim(),
                })),
                grade: selectedDropdowns.grade,
                institution: selectedDropdowns.institution,
                classroom: selectedDropdowns.classroom,
                schedule: selectedDropdowns.schedule,
            });

            if (response.data.success) {
                alert('Estudiantes agregados exitosamente.');
                setStudents([]); // Limpiar tabla
            } else {
                console.error('Error del servidor:', response.data.message);
                alert(response.data.message || 'Error al agregar estudiantes.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error.response?.data || error.message);
            alert('Error al agregar estudiantes.');
        }
    };

    return (
        <div className="enrollment-page">
            <div className="enrollment-page-title-container">
                <h2 className="typewriter-text">{typedText}</h2>
            </div>
            <div className="filters-container">
                <select name="grade" onChange={handleDropdownChange}>
                    <option value="">Grado</option>
                    {dropdownOptions.grades.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                    ))}
                </select>
                <select name="institution" onChange={handleDropdownChange}>
                    <option value="">Institución</option>
                    {dropdownOptions.institutions.map((institution) => (
                        <option key={institution} value={institution}>{institution}</option>
                    ))}
                </select>
                <select name="classroom" onChange={handleDropdownChange}>
                    <option value="">Aula</option>
                    {dropdownOptions.classrooms.map((classroom) => (
                        <option key={classroom} value={classroom}>{classroom}</option>
                    ))}
                </select>
                <select name="schedule" onChange={handleDropdownChange}>
                    <option value="">Horario</option>
                    {dropdownOptions.schedules.map((schedule) => (
                        <option key={schedule} value={schedule}>{schedule}</option>
                    ))}
                </select>
            </div>

            <table className="students-table">
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Número de Teléfono</th>
                        <th>Correo Electrónico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    value={student.fullName}
                                    onChange={(e) => handleInputChange(index, 'fullName', e.target.value)}
                                    placeholder="Nombre completo"
                                    className="input-clean"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={student.phoneNumber}
                                    onChange={(e) => handleInputChange(index, 'phoneNumber', e.target.value)}
                                    placeholder="Teléfono"
                                    className="input-clean"
                                />
                            </td>
                            <td>
                                <input
                                    type="email"
                                    value={student.email}
                                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                                    placeholder="Correo electrónico"
                                    className="input-clean"
                                />
                            </td>
                            <td>
                                <button onClick={() => removeRow(index)} className="btn-remove">✖</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="actions-container">
                <button onClick={addRow} className="btn-action">Añadir Fila</button>
                <button onClick={addStudents} className="btn-action">Agregar Estudiantes</button>
            </div>
        </div>
    );
};

export default Enrollment;
