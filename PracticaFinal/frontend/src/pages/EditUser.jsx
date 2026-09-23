import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUser } from "../api/userService";

export default function EditUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const targetUser = location.state?.user;

  const [formData, setFormData] = useState({
    nombre: targetUser?.nombre || "",
    email: targetUser?.email || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!targetUser) {
    return (
      <div style={{ maxWidth: "400px", margin: "50px auto" }}>
        <p>No se encontró información del usuario. Vuelve al dashboard e inténtalo de nuevo.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateUser(targetUser.id, formData);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el usuario");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Editar usuario</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Correo:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>¡Actualizado! Regresando...</p>}
        <button type="submit" style={{ padding: "10px 20px" }}>
          Guardar cambios
        </button>
      </form>
    </div>
  );
}