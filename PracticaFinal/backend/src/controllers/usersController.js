import { getActiveUsers, getUserById, updateUser, updateUserRole, softDeleteUser } from '../models/usersModel.js';

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await getActiveUsers();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol } = req.body;
  const solicitante = req.usuario; // { id, rol } viene del JWT, puesto ahí por verifyToken

  // Un operativo solo puede editar su propio registro
  if (solicitante.rol !== 'administrador' && String(solicitante.id) !== String(id)) {
    return res.status(403).json({ error: 'No tienes permiso para editar este usuario' });
  }

  // Cambiar el rol de alguien solo lo puede hacer un administrador
  if (rol && solicitante.rol !== 'administrador') {
    return res.status(403).json({ error: 'Solo un administrador puede cambiar roles' });
  }

  try {
    const usuario = await getUserById(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    await updateUser(id, { nombre: nombre ?? usuario.nombre, correo: correo ?? usuario.correo });
    if (rol) await updateUserRole(id, rol);

    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  const solicitante = req.usuario;

  if (solicitante.rol !== 'administrador') {
    return res.status(403).json({ error: 'Solo un administrador puede eliminar usuarios' });
  }

  try {
    const usuario = await getUserById(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado o ya estaba dado de baja' });

    await softDeleteUser(id);
    res.json({ mensaje: 'Usuario dado de baja' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};