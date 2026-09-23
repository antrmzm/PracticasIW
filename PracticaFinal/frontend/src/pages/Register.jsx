/* /login muestra el formulario de inicio de sesión
/register muestra el formulario de registro
La raíz (/) redirija automáticamente a /login*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    pregunta: "",
    respuesta: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar el usuario");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Registro de usuario</h2>
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
        <div style={{ marginBottom: "10px" }}>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Pregunta de seguridad:</label>
          <select
            name="pregunta"
            value={formData.pregunta}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">-- Selecciona una pregunta --</option>
            <option value="mascota">¿Cómo se llamó tu primera mascota?</option>
            <option value="ciudad">¿En qué ciudad naciste?</option>
            <option value="escuela">¿Cómo se llamaba tu escuela primaria?</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Respuesta:</label>
          <input
            type="text"
            name="respuesta"
            value={formData.respuesta}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && (
          <p style={{ color: "green" }}>¡Registrado! Redirigiendo...</p>
        )}
        <button type="submit" style={{ padding: "10px 20px" }}>
          Registrarse
        </button>
      </form>
    </div>
  );
}