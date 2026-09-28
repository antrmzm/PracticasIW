import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSecurityQuestion, resetPassword } from "../api/authService";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [respuestaSeguridad, setRespuestaSeguridad] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Paso 1: buscar la cuenta y obtener la pregunta de seguridad
  const handleBuscar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const response = await getSecurityQuestion(correo);
      setPregunta(response.data.pregunta_seguridad);
      setStep(2);
    } catch (err) {
      console.error(err);
      const mensaje = err.response?.data?.error || "No se encontró una cuenta con ese correo";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  // Paso 2: validar la respuesta y guardar la nueva contraseña
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await resetPassword({
        correo: correo,
        respuesta_seguridad: respuestaSeguridad,
        nueva_contrasena: nuevaContrasena,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      const mensaje = err.response?.data?.error || "La respuesta no es correcta";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthLayout
      titulo="Recuperar contraseña"
      descripcion={
        step === 1
          ? "Paso 1 de 2. Escribe el correo con el que te registraste."
          : "Paso 2 de 2. Responde tu pregunta de seguridad y elige una nueva contraseña."
      }
      pie={<Link to="/login">Volver a iniciar sesión</Link>}
    >
      {step === 1 && (
        <form onSubmit={handleBuscar} className="form">
          <div className="field">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          {error && <p className="alert alert-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
            {cargando ? "Buscando..." : "Buscar cuenta"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleReset} className="form">
          <div className="field">
            <label>Tu pregunta de seguridad</label>
            <p style={{ fontWeight: 500 }}>{pregunta}</p>
          </div>
          <div className="field">
            <label htmlFor="respuesta">Respuesta</label>
            <input
              id="respuesta"
              type="text"
              value={respuestaSeguridad}
              onChange={(e) => setRespuestaSeguridad(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="nueva">Nueva contraseña</label>
            <input
              id="nueva"
              type="password"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <span className="field-hint">Mínimo 6 caracteres.</span>
          </div>
          {error && <p className="alert alert-error">{error}</p>}
          {success && <p className="alert alert-success">Contraseña actualizada. Redirigiendo...</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={cargando || success}>
            {cargando ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}