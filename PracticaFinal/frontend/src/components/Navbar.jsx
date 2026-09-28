/* Muestra "Iniciar sesión" y "Crear cuenta" cuando no hay sesión activa.
   Muestra "Usuarios", el nombre y rol de quien inició sesión, y un botón
   de "Cerrar sesión" cuando sí hay sesión.
   Al cerrar sesión, borra el token y regresa a /login. */
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Devuelve la clase del enlace, marcando el que está activo
const claseEnlace = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const esAdmin = user?.rol === "administrador";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="brand">
          Panel de usuarios
        </Link>

        {!isAuthenticated && (
          <>
            <NavLink to="/login" className={claseEnlace}>
              Iniciar sesión
            </NavLink>
            <NavLink to="/register" className={claseEnlace}>
              Crear cuenta
            </NavLink>
          </>
        )}
        {isAuthenticated && (
          <NavLink to="/dashboard" className={claseEnlace}>
            Usuarios
          </NavLink>
        )}
      </div>

      {isAuthenticated && (
        <div className="navbar-right">
          <div className="nav-user">
            <span className="nav-user-name">{user?.nombre || user?.email}</span>
            <span className={"badge " + (esAdmin ? "badge-admin" : "badge-operativo")}>
              {esAdmin ? "Administrador" : "Operativo"}
            </span>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm">
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}