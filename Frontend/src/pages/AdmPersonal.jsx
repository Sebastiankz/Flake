import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admpersonal.css";

const AdmPersonal = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    password: "",
    full_name: "",
    role: "instructor",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/personal");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await axios.put(
          `http://localhost:5000/personal/${formData.id}`,
          formData
        );
        alert("Usuario actualizado correctamente");
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Error al actualizar el usuario");
      }
    } else {
      try {
        await axios.post("http://localhost:5000/personal", formData);
        alert("Usuario agregado correctamente");
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Error al agregar usuario");
      }
    }
    setFormData({
      id: "",
      username: "",
      password: "",
      full_name: "",
      role: "instructor",
      email: "",
    });
    setShowForm(false);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    fetch(`http://localhost:5000/personal/${id}`, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert('Usuario eliminado exitosamente');
                // Refrescar la lista de usuarios
                fetchUsers();
            } else {
                alert(data.message || 'Error al eliminar usuario');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al eliminar usuario');
        });
};


  const toggleForm = () => {
    setShowForm(!showForm);
    setIsEditing(false);
    setFormData({
      id: "",
      username: "",
      password: "",
      full_name: "",
      role: "instructor",
      email: "",
    });
  };

  return (
    <div className="admpersonal-page">
      <h2 className="typewriter-title">Gestión de Personal</h2>
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre Completo</th>
              <th>Rol</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.full_name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(user.id, user.role)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn-add" onClick={toggleForm}>
        {showForm ? "Cancelar" : "Agregar Usuario"}
      </button>

      {showForm && (
        <form className="user-form" onSubmit={handleFormSubmit}>
          <h3>{isEditing ? "Editar Usuario" : "Agregar Nuevo Usuario"}</h3>
          <input
            type="text"
            placeholder="Usuario"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Nombre Completo"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            required
          />
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="instructor">Instructor</option>
            <option value="admin">Administrador</option>
          </select>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
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

export default AdmPersonal;
