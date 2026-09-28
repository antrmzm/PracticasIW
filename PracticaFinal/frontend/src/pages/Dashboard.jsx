import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../api/userService";
import { useAuth } from "../context/AuthContext";
import UserCard from "../components/UserCard";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      const mensaje = err.response?.data?.error || "No se pudieron cargar los usuarios";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta al confirmar en la ventana de eliminación
  const confirmarEliminacion = async () => {
    setEliminando(true);
    try {
      await deleteUser(usuarioAEliminar.id);
      setUsuarioAEliminar(null);
      setError("");
      loadUsers();
    } catch (err) {
      console.error(err);
      const mensaje = err.response?.data?.error || "No se pudo eliminar el usuario";
      setError(mensaje);
      setUsuarioAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  const handleEdit = (targetUser) => {
    navigate("/users/" + targetUser.id + "/edit", { state: { user: targetUser } });
  };

  // Filtra por nombre o correo mientras se escribe en el buscador
  const texto = busqueda.trim().toLowerCase();
  const usuariosFiltrados = users.filter((u) => {
    return (
      u.nombre.toLowerCase().includes(texto) ||
      u.correo.toLowerCase().includes(texto)
    );
  });

  const isAdmin = user?.rol === "administrador";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Usuarios registrados</h1>
          <p className="muted">
            {isAdmin
              ? "Como administrador puedes editar y eliminar a cualquier usuario."
              : "Puedes editar únicamente tus propios datos."}
          </p>
        </div>
        <input
          type="search"
          className="search"
          placeholder="Buscar por nombre o correo"
          aria-label="Buscar usuarios"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {error && <p className="alert alert-error" style={{ marginBottom: "18px" }}>{error}</p>}

      {cargando && (
        <div className="empty-state">
          Cargando usuarios... Si el servidor estaba en reposo, puede tardar hasta un minuto.
        </div>
      )}

      {!cargando && usuariosFiltrados.length === 0 && !error && (
        <div className="empty-state">
          {texto ? "Ningún usuario coincide con tu búsqueda." : "Todavía no hay usuarios registrados."}
        </div>
      )}

      <div className="grid">
        {usuariosFiltrados.map((u) => {
          const isSelf = user?.id === u.id;
          const canEdit = isAdmin || isSelf;
          const canDelete = isAdmin;

          return (
            <UserCard
              key={u.id}
              user={u}
              isSelf={isSelf}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={handleEdit}
              onDelete={setUsuarioAEliminar}
            />
          );
        })}
      </div>

      {usuarioAEliminar && (
        <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal">
            <h2 id="titulo-modal">Eliminar usuario</h2>
            <p className="muted">
              ¿Seguro que quieres eliminar a {usuarioAEliminar.nombre}? Dejará de aparecer en el panel.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setUsuarioAEliminar(null)}
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmarEliminacion} disabled={eliminando}>
                {eliminando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}