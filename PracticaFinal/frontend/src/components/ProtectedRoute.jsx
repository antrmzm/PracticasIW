
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.rol)) {
    return (
      <div className="page page-narrow">
        <div className="notice">
          <h2>Acceso restringido</h2>
          <p>No tienes permiso para ver esta página.</p>
        </div>
      </div>
    );
  }

  return children;
}