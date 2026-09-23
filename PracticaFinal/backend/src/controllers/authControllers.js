import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createUser, getByEmail } from '../models/usersModel.js';
import { validateUser } from '../models/validator.js';

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