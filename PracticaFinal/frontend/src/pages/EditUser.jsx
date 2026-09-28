import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { updateUser } from "../api/userService";
import { useAuth } from "../context/AuthContext";

export default function EditUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const targetUser = location.state?.user;
  const isAdmin = user?.rol === "administrador";

  const [formData, setFormData] = useState({
    nombre: targetUser?.nombre || "",
    correo: targetUser?.correo || "",
    rol: targetUser?.rol || "operativo",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cargando, setCargando] = useState(false);

  if (!targetUser) {
    return (
      <div className="page page-narrow">
        <div className="notice">
          <h2>No encontramos al usuario</h2>
          <p style={{ marginBottom: "16px" }}>
            Vuelve al panel y elige de nuevo al usuario que quieres editar.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Volver al panel
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    // Un operativo nunca debe mandar el campo "rol", o la API lo rechaza
    const dataToSend = { nombre: formData.nombre, correo: formData.correo };
    if (isAdmin) {
      dataToSend.rol = formData.rol;
    }

    try {
      await updateUser(targetUser.id, dataToSend);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error(err);
      const mensaje = err.response?.data?.error || "No se pudo actualizar el usuario";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="page page-narrow">
      <Link to="/dashboard" className="back-link">
        Volver al panel
      </Link>
      <div className="form-card">
        <h1 style={{ marginBottom: "6px" }}>Editar usuario</h1>
        <p className="muted" style={{ marginBottom: "24px" }}>
          Modifica los datos y guarda los cambios.
        </p>
        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          {isAdmin && (
            <div className="field">
              <label htmlFor="rol">Rol</label>
              <select id="rol" name="rol" value={formData.rol} onChange={handleChange}>
                <option value="operativo">Operativo</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          )}
          {error && <p className="alert alert-error">{error}</p>}
          {success && <p className="alert alert-success">Cambios guardados. Regresando al panel...</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={cargando || success}>
            {cargando ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}