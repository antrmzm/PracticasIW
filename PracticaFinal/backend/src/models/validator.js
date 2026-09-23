export const validateUser = ({ nombre, correo, contrasena, pregunta_seguridad, respuesta_seguridad }) => {
  if (!nombre || nombre.length < 2) {
    throw new Error('Nombre inválido');
  }
  if (!correo || !correo.includes('@')) {
    throw new Error('Correo inválido');
  }
  if (!contrasena || contrasena.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }
  if (!pregunta_seguridad) {
    throw new Error('Pregunta de seguridad requerida');
  }
  if (!respuesta_seguridad) {
    throw new Error('Respuesta de seguridad requerida');
  }
};