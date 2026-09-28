// Diseño compartido por Login, Registro y Recuperar contraseña:
// formulario centrado dentro de una tarjeta.
export default function AuthLayout({ titulo, descripcion, pie, children }) {
  return (
    <div className="auth">
      <section className="auth-panel">
        <h1>{titulo}</h1>
        {descripcion && <p className="muted" style={{ marginTop: "8px" }}>{descripcion}</p>}
        {children}
        {pie && <div className="auth-footer">{pie}</div>}
      </section>
    </div>
  );
}