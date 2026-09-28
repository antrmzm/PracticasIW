import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const response = await loginUser({ correo: correo, contrasena: contrasena });
      const { token, id, rol, nombre } = response.data;
      login(token, { id: id, rol: rol, nombre: nombre });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const mensaje = err.response?.data?.error || "Correo o contraseña incorrectos";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthLayout
      titulo="Iniciar sesión"
      descripcion="Ingresa con tu correo y contraseña para continuar."
      pie={
        <>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          <span>
            ¿Aún no tienes cuenta? <Link to="/register">Crea una aquí</Link>
          </span>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="form">
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
        <div className="field">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error && <p className="alert alert-error">{error}</p>}
        {cargando && (
          <p className="field-hint">
            Verificando tus datos. Si el servidor estaba en reposo, la primera
            respuesta puede tardar hasta un minuto.
          </p>
        )}
        <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </AuthLayout>
  );
}