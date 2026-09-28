import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    pregunta_seguridad: "",
    respuesta_seguridad: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await registerUser(formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      const mensaje = err.response?.data?.error || "No se pudo registrar el usuario";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthLayout
      titulo="Crear cuenta"
      descripcion="Completa tus datos. La pregunta de seguridad te servirá para recuperar tu contraseña."
      pie={
        <span>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            autoComplete="name"
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
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <span className="field-hint">Mínimo 6 caracteres.</span>
        </div>
        <div className="field">
          <label htmlFor="pregunta_seguridad">Pregunta de seguridad</label>
          <select
            id="pregunta_seguridad"
            name="pregunta_seguridad"
            value={formData.pregunta_seguridad}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una pregunta</option>
            <option value="¿Cómo se llamó tu primera mascota?">¿Cómo se llamó tu primera mascota?</option>
            <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
            <option value="¿Cuál es tu color favorito?">¿Cuál es tu color favorito?</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="respuesta_seguridad">Respuesta</label>
          <input
            id="respuesta_seguridad"
            type="text"
            name="respuesta_seguridad"
            value={formData.respuesta_seguridad}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="alert alert-error">{error}</p>}
        {success && <p className="alert alert-success">Cuenta creada. Redirigiendo al inicio de sesión...</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={cargando || success}>
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
    </AuthLayout>
  );
}