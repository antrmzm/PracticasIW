// Tarjeta de un usuario dentro del panel.
// Recibe permisos ya calculados (canEdit, canDelete) desde el Dashboard.

// Toma las iniciales del nombre para mostrarlas en el avatar
function obtenerIniciales(nombre) {
  if (!nombre) return "?";
  const partes = nombre.trim().split(" ");
  const primera = partes[0].charAt(0);
  const segunda = partes.length > 1 ? partes[1].charAt(0) : "";
  return (primera + segunda).toUpperCase();
}

export default function UserCard({ user, isSelf, canEdit, canDelete, onEdit, onDelete }) {
  const esAdmin = user.rol === "administrador";

  return (
    <article className={"card" + (isSelf ? " card-self" : "")}>
      <div className="card-head">
        <div className="avatar" translate="no">{obtenerIniciales(user.nombre)}</div>
        <div>
          <h3>{user.nombre}</h3>
          <p className="card-email">{user.correo}</p>
        </div>
      </div>

      <div className="card-meta">
        <span className={"badge " + (esAdmin ? "badge-admin" : "badge-operativo")}>
          {esAdmin ? "Administrador" : "Operativo"}
        </span>
        {isSelf && <span className="muted" style={{ fontSize: "0.85rem" }}>Este eres tú</span>}
      </div>

      {(canEdit || canDelete) && (
        <div className="card-actions">
          {canEdit && (
            <button onClick={() => onEdit(user)} className="btn btn-ghost btn-sm">
              Editar
            </button>
          )}
          {canDelete && (
            <button onClick={() => onDelete(user)} className="btn btn-danger-ghost btn-sm">
              Eliminar
            </button>
          )}
        </div>
      )}
    </article>
  );
}