import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../api/userService";
import { useAuth } from "../context/AuthContext";
import UserCard from "../components/UserCard";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
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
      setError("No se pudieron cargar los usuarios");
    }
  };

  const handleDelete = async (targetUser) => {
    if (!window.confirm("¿Eliminar a " + targetUser.nombre + "?")) return;

    try {
      await deleteUser(targetUser.id);
      loadUsers();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el usuario");
    }
  };

  const handleEdit = (targetUser) => {
    navigate("/users/" + targetUser.id + "/edit", { state: { user: targetUser } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Usuarios registrados</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {users.map((u) => {
          const isAdmin = user?.rol === "administrador";
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
              onDelete={handleDelete}
            />
          );
        })}
      </div>
    </div>
  );
}