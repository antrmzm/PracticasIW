import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSecurityQuestion, resetPassword } from "../api/authService";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleBuscar = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await getSecurityQuestion(email);
      setPregunta(response.data.pregunta);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("No se encontró una cuenta con ese correo");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await resetPassword({ email, respuesta, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError("La respuesta no es correcta, o hubo un problema al cambiar la contraseña");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Recuperar contraseña</h2>

      {step === 1 && (
        <form onSubmit={handleBuscar}>
          <div style={{ marginBottom: "10px" }}>
            <label>Correo:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" style={{ padding: "10px 20px" }}>
            Buscar cuenta
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleReset}>
          <p>
            <strong>Pregunta de seguridad:</strong> {pregunta}
          </p>
          <div style={{ marginBottom: "10px" }}>
            <label>Respuesta:</label>
            <input
              type="text"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Nueva contraseña:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && (
            <p style={{ color: "green" }}>¡Contraseña actualizada! Redirigiendo...</p>
          )}
          <button type="submit" style={{ padding: "10px 20px" }}>
            Cambiar contraseña
          </button>
        </form>
      )}

      <p style={{ marginTop: "10px" }}>
        <Link to="/login">Volver a iniciar sesión</Link>
      </p>
    </div>
  );
}