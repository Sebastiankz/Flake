import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/admaulas.css";

const AdmAulas = () => {
  const [aulas, setAulas] = useState([]);
  const [formData, setFormData] = useState({
    id_aula: "",
    grad_text: "",
    grad_num: "",
    jornada: "",
    num_grupo: "",
    id_profesor: "",
    user_id: "",
    institution: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/aulas");
      setAulas(response.data);
    } catch (error) {
      console.error("Error fetching aulas:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/aulas/${formData.id_aula}`,
          formData
        );
        alert("Aula actualizada correctamente");
      } else {
        await axios.post("http://localhost:5000/aulas", formData);
        alert("Aula agregada correctamente");
      }
      fetchAulas();
      resetForm();
    } catch (error) {
      console.error("Error saving aula:", error);
      alert("Error al guardar el aula");
    }
  };

  const handleEdit = (aula) => {
    setFormData(aula);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta aula?")) return;
    try {
      await axios.delete(`http://localhost:5000/aulas/${id}`);
      alert("Aula eliminada exitosamente");
      fetchAulas();
    } catch (error) {
      console.error("Error deleting aula:", error);
      alert("Error al eliminar aula");
    }
  };

  const resetForm = () => {
    setFormData({
      id_aula: "",
      grad_text: "",
      grad_num: "",
      jornada: "",
      num_grupo: "",
      id_profesor: "",
      user_id: "",
      institution: "",
    });
    setShowForm(false);
    setIsEditing(false);
  };

  return (
    <div className="admaulas-page">
      <h2 className="typewriter-title">Gestión de Aulas</h2>
      <div className="table-container">
        <table className="aulas-table">
          <thead>
            <tr>
              <th>ID Aula</th>
              <th>Grado (Texto)</th>
              <th>Grado (Número)</th>
              <th>Jornada</th>
              <th>Número de Grupo</th>
              <th>ID Profesor</th>
              <th>ID Usuario</th>
              <th>Institución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {aulas.map((aula) => (
              <tr key={aula.id_aula}>
                <td>{aula.id_aula}</td>
                <td>{aula.grad_text}</td>
                <td>{aula.grad_num}</td>
                <td>{aula.jornada}</td>
                <td>{aula.num_grupo}</td>
                <td>{aula.id_profesor}</td>
                <td>{aula.user_id}</td>
                <td>{aula.institution}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(aula)}>
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(aula.id_aula)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-add" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Agregar Aula"}
      </button>
      {showForm && (
        <form className="aula-form" onSubmit={handleFormSubmit}>
          <h3>{isEditing ? "Editar Aula" : "Agregar Nueva Aula"}</h3>
          <input
            type="text"
            placeholder="ID Aula"
            value={formData.id_aula}
            onChange={(e) =>
              setFormData({ ...formData, id_aula: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Grado (Texto)"
            value={formData.grad_text}
            onChange={(e) =>
              setFormData({ ...formData, grad_text: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Grado (Número)"
            value={formData.grad_num}
            onChange={(e) =>
              setFormData({ ...formData, grad_num: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Jornada"
            value={formData.jornada}
            onChange={(e) =>
              setFormData({ ...formData, jornada: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Número de Grupo"
            value={formData.num_grupo}
            onChange={(e) =>
              setFormData({ ...formData, num_grupo: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="ID Profesor"
            value={formData.id_profesor}
            onChange={(e) =>
              setFormData({ ...formData, id_profesor: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="ID Usuario"
            value={formData.user_id}
            onChange={(e) =>
              setFormData({ ...formData, user_id: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Institución"
            value={formData.institution}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            required
          />
          <button type="submit" className="btn-save">
            Guardar
          </button>
        </form>
      )}
    </div>
  );
};

export default AdmAulas;
