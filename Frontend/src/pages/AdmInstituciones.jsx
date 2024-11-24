import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminstituciones.css";

const AdmInstituciones = () => {
  const [institutions, setInstitutions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cod_DANE: "",
    numero: "",
    localidad: "",
    nombre: "",
    nombre_rector: "",
    direccion: "",
    barrio: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/instituciones");
      setInstitutions(response.data);
    } catch (error) {
      console.error("Error fetching institutions:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/instituciones/${formData.cod_DANE}`,
          formData
        );
        alert("Institución actualizada correctamente");
      } else {
        await axios.post("http://localhost:5000/instituciones", formData);
        alert("Institución agregada correctamente");
      }
      setFormData({
        cod_DANE: "",
        numero: "",
        localidad: "",
        nombre: "",
        nombre_rector: "",
        direccion: "",
        barrio: "",
      });
      setShowForm(false);
      setIsEditing(false);
      fetchInstitutions();
    } catch (error) {
      console.error("Error saving institution:", error);
      alert("Error al guardar la institución");
    }
  };

  const handleEdit = (institution) => {
    setFormData(institution);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (cod_DANE) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta institución?")) return;
    try {
      await axios.delete(`http://localhost:5000/instituciones/${cod_DANE}`);
      alert("Institución eliminada exitosamente");
      fetchInstitutions();
    } catch (error) {
      console.error("Error deleting institution:", error);
      alert("Error al eliminar institución");
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setIsEditing(false);
    setFormData({
      cod_DANE: "",
      numero: "",
      localidad: "",
      nombre: "",
      nombre_rector: "",
      direccion: "",
      barrio: "",
    });
  };

  return (
    <div className="adminstituciones-page">
      <h2 className="typewriter-title">Gestión de Instituciones</h2>
      <div className="table-container">
        <table className="institutions-table">
          <thead>
            <tr>
              <th>Código DANE</th>
              <th>Número</th>
              <th>Localidad</th>
              <th>Nombre</th>
              <th>Nombre del Rector</th>
              <th>Dirección</th>
              <th>Barrio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {institutions && institutions.length > 0 ? (
              institutions.map((institution, index) => (
                <tr key={index}>
                  <td>{institution.cod_DANE}</td>
                  <td>{institution.numero}</td>
                  <td>{institution.localidad}</td>
                  <td>{institution.nombre}</td>
                  <td>{institution.nombre_rector}</td>
                  <td>{institution.direccion}</td>
                  <td>{institution.barrio}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(institution)}>
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(institution.cod_DANE)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No hay instituciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="btn-add" onClick={toggleForm}>
        {showForm ? "Cancelar" : "Agregar Institución"}
      </button>

      {showForm && (
        <form className="institution-form" onSubmit={handleFormSubmit}>
          <h3>{isEditing ? "Editar Institución" : "Agregar Nueva Institución"}</h3>
          <input
            type="text"
            placeholder="Código DANE"
            value={formData.cod_DANE}
            onChange={(e) => setFormData({ ...formData, cod_DANE: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Número"
            value={formData.numero}
            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Localidad"
            value={formData.localidad}
            onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Nombre del Rector"
            value={formData.nombre_rector}
            onChange={(e) => setFormData({ ...formData, nombre_rector: e.target.value })}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Barrio"
            value={formData.barrio}
            onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
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

export default AdmInstituciones;
