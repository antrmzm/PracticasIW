import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validateUser } from '../models/validator.js';
import { createUser, getByEmail, getSecurityQuestionByEmail, updatePasswordById } from '../models/usersModel.js';

export const registro = async (req, res) => {
  try {
    validateUser(req.body);
    const id = await createUser(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const usuario = await getByEmail(correo);

    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, id: usuario.id, rol: usuario.rol, nombre: usuario.nombre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const verificarRecuperacion = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ error: 'Correo requerido' });

    const usuario = await getSecurityQuestionByEmail(correo);
    if (!usuario) return res.status(404).json({ error: 'No se encontró una cuenta con ese correo' });

    res.json({ pregunta_seguridad: usuario.pregunta_seguridad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmarRecuperacion = async (req, res) => {
  try {
    const { correo, respuesta_seguridad, nueva_contrasena } = req.body;
    if (!correo || !respuesta_seguridad || !nueva_contrasena) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    if (nueva_contrasena.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    const usuario = await getSecurityQuestionByEmail(correo);
    if (!usuario) return res.status(404).json({ error: 'No se encontró una cuenta con ese correo' });

    const respuestaValida = await bcrypt.compare(
      respuesta_seguridad.trim().toLowerCase(),
      usuario.respuesta_seguridad
    );
    if (!respuestaValida) return res.status(401).json({ error: 'La respuesta de seguridad no coincide' });

    const nuevoHash = await bcrypt.hash(nueva_contrasena, 10);
    await updatePasswordById(usuario.id, nuevoHash);

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};