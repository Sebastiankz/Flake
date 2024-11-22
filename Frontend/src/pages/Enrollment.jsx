import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/enrollment.css';

const Enrollment = () => {
    const [institutions, setInstitutions] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [typedText, setTypedText] = useState('');
    const message = 'Inscripciones';

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

    // Obtener instituciones al cargar el componente
    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/instituciones');
                setInstitutions(response.data);
            } catch (error) {
                console.error('Error al obtener instituciones:', error);
            }
        };
        fetchInstitutions();
    }, []);

    // Obtener aulas según la institución seleccionada
    const fetchClassrooms = async () => {
        if (!selectedInstitution) return;
        try {
            const response = await axios.get(`http://localhost:5000/aulas/${selectedInstitution}`);
            setClassrooms(response.data);
        } catch (error) {
            console.error('Error al obtener aulas:', error);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, [selectedInstitution]);

    // Manejar cambio en los dropdowns
    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        if (name === 'institution') {
            setSelectedInstitution(value);
        } else if (name === 'classroom') {
            setSelectedClassroom(value);
        }
    };

    // Manejar cambio en los inputs de estudiantes
    const handleInputChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);
    };

    // Agregar una nueva fila para un estudiante
    const addRow = () => {
        setStudents([
            ...students,
            {
                tipo_id: '',
                prim_nom: '',
                seg_nom: '',
                prim_apell: '',
                seg_apell: '',
                genero: '',
                fecha_nacimiento: '',
                estrato: '',
                celular: '',
                edad: '',
                direccion: '',
                correo: '',
            },
        ]);
    };

    // Eliminar una fila de estudiantes
    const removeRow = (index) => {
        const updatedStudents = [...students];
        updatedStudents.splice(index, 1);
        setStudents(updatedStudents);
    };

    // Enviar estudiantes al backend
    const addStudents = async () => {
        if (!selectedInstitution || !selectedClassroom) {
            alert('Por favor selecciona una institución y un aula.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/alumnos', {
                students,
                id_aula: selectedClassroom,
            });

            if (response.status === 201) {
                alert('Estudiantes registrados exitosamente.');
                setStudents([]); // Limpiar la tabla
            } else {
                console.error('Error del servidor:', response.data.message);
                alert(response.data.message || 'Error al registrar estudiantes.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error.response?.data || error.message);
            alert('Error al registrar estudiantes.');
        }
    };

    return (
        <div className="enrollment-page">
            <div className="enrollment-page-title-container">
                <h2 className="typewriter-text">{typedText}</h2>
            </div>
            <div className="filters-container">
                <select name="institution" onChange={handleDropdownChange}>
                    <option value="">Institución</option>
                    {institutions.map((institution) => (
                        <option key={institution.cod_DANE} value={institution.cod_DANE}>
                            {institution.nombre}
                        </option>
                    ))}
                </select>
                <select name="classroom" onChange={handleDropdownChange}>
                    <option value="">Aula</option>
                    {classrooms.map((classroom) => (
                        <option key={classroom.id_aula} value={classroom.id_aula}>
                            {`${classroom.grad_num}° - Grupo ${classroom.num_grupo} (${classroom.jornada})`}
                        </option>
                    ))}
                </select>
            </div>

            <table className="students-table">
                <thead>
                    <tr>
                        <th>Tipo ID</th>
                        <th>Primer Nombre</th>
                        <th>Segundo Nombre</th>
                        <th>Primer Apellido</th>
                        <th>Segundo Apellido</th>
                        <th>Género</th>
                        <th>Fecha Nacimiento</th>
                        <th>Estrato</th>
                        <th>Número de Teléfono</th>
                        <th>Edad</th>
                        <th>Dirección</th>
                        <th>Correo Electrónico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            {Object.keys(student).map((field) => (
                                <td key={field}>
                                    <input
                                        type="text"
                                        value={student[field]}
                                        onChange={(e) => handleInputChange(index, field, e.target.value)}
                                        placeholder={field.replace(/_/g, ' ')}
                                        className="input-clean"
                                    />
                                </td>
                            ))}
                            <td>
                                <button onClick={() => removeRow(index)} className="btn-remove">✖</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="actions-container">
                <button onClick={addRow} className="btn-action">Añadir Fila</button>
                <button onClick={addStudents} className="btn-action">Registrar Estudiantes</button>
            </div>
        </div>
    );
};

export default Enrollment;
