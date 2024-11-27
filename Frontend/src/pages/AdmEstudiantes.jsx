import React, { useState, useEffect } from "react";
import "../styles/admestudiantes.css";
import axios from "axios";

const AdmEstudiantes = () => {
  const [students, setStudents] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    phone_number: "",
    email: "",
    grade: "",
    institution: "",
    classroom: "",
    schedule: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/estudiantes");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { full_name, email, institution } = formData;
    if (!full_name || !email || !institution) {
      alert("Por favor, completa todos los campos obligatorios.");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditing) {
      // Actualizar estudiante
      try {
        await axios.put(`http://localhost:5000/estudiantes/${formData.id}`, formData);
        alert("Estudiante actualizado correctamente.");
      } catch (error) {
        console.error("Error updating student:", error);
        alert("Error al actualizar estudiante.");
      }
    } else {
      // Crear nuevo estudiante
      try {
        await axios.post("http://localhost:5000/estudiantes", formData);
        alert("Estudiante agregado correctamente.");
      } catch (error) {
        console.error("Error adding student:", error);
        alert("Error al agregar estudiante.");
      }
    }
    resetForm();
    fetchStudents();
  };

  const handleEdit = (student) => {
    setFormData(student);
    setIsEditing(true);
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este estudiante?")) return;

    axios
      .delete(`http://localhost:5000/estudiantes/${id}`)
      .then(() => {
        alert("Estudiante eliminado correctamente.");
        fetchStudents();
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
        alert("Error al eliminar estudiante.");
      });
  };

  const resetForm = () => {
    setFormData({
      id: "",
      full_name: "",
      phone_number: "",
      email: "",
      grade: "",
      institution: "",
      classroom: "",
      schedule: "",
    });
    setIsEditing(false);
    setFormVisible(false);
  };

  return (
    <div className="admestudiantes-page">
      <h1 className="typewriter-title">Gestión de Estudiantes</h1>
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Teléfono</th>
              <th>Correo Electrónico</th>
              <th>Grado</th>
              <th>Institución</th>
              <th>Aula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.full_name}</td>
                <td>{student.phone_number}</td>
                <td>{student.email}</td>
                <td>{student.grade}</td>
                <td>{student.institution}</td>
                <td>{student.classroom}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(student)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(student.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-add" onClick={() => setFormVisible(true)}>
          Agregar Estudiante
        </button>
      </div>

      {formVisible && (
        <form className="student-form" onSubmit={handleFormSubmit}>
          <h3>{isEditing ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}</h3>
          <input
            type="text"
            name="full_name"
            placeholder="Nombre Completo"
            value={formData.full_name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Teléfono"
            value={formData.phone_number}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="grade"
            placeholder="Grado"
            value={formData.grade}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="institution"
            placeholder="Institución"
            value={formData.institution}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="classroom"
            placeholder="Aula"
            value={formData.classroom}
            onChange={handleInputChange}
          />

          <button className="btn-save" type="submit">
            Guardar
          </button>
          <button className="btn-cancel" type="button" onClick={resetForm}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};

export default AdmEstudiantes;
