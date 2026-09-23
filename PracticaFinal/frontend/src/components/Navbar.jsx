/*Muestra "Iniciar sesión" y "Registrarse" cuando no hay sesión activa
Muestra "Usuarios" (link al dashboard) y un botón de "Cerrar sesión" cuando sí hay sesión
Al cerrar sesión, borra el token y regresa a /login   */
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div style={{ display: "flex", gap: "16px" }}>
        {!isAuthenticated && (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
        {isAuthenticated && <Link to="/dashboard">Usuarios</Link>}
      </div>

      {isAuthenticated && (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span>Hola, {user?.nombre || user?.email}</span>
          <button onClick={handleLogout} style={{ padding: "6px 12px" }}>
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}