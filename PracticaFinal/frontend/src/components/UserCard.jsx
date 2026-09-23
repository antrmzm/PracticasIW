export default function UserCard({ user, isSelf, canEdit, canDelete, onEdit, onDelete }) {
  return (
    <div
      style={{
        border: isSelf ? "2px solid #2563eb" : "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        width: "250px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        backgroundColor: isSelf ? "#eff6ff" : "#ffffff",
      }}
    >
      {isSelf && <p style={{ color: "#2563eb", fontWeight: "bold", margin: 0 }}>Tú</p>}
      <h3>{user.nombre}</h3>
      <p>{user.email}</p>
      <p>
        <strong>Rol:</strong> {user.rol}
      </p>
      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        {canEdit && (
          <button onClick={() => onEdit(user)} style={{ padding: "6px 12px" }}>
            Editar
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(user)}
            style={{ padding: "6px 12px", color: "red" }}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}