import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConnection } from '../config/db.js';

export const createUser = async ({ nombre, correo, contrasena, pregunta_seguridad, respuesta_seguridad }) => {
  const hashContrasena = await bcrypt.hash(contrasena, 10);
  const hashRespuesta = await bcrypt.hash(respuesta_seguridad.trim().toLowerCase(), 10);

  const pool = await getConnection();
  try {
    const result = await pool.request()
      .input('nombre', nombre)
      .input('correo', correo)
      .input('contrasena', hashContrasena)
      .input('pregunta_seguridad', pregunta_seguridad)
      .input('respuesta_seguridad', hashRespuesta)
      .query(`
        INSERT INTO usuarios (nombre, correo, contrasena, pregunta_seguridad, respuesta_seguridad, rol)
        VALUES (@nombre, @correo, @contrasena, @pregunta_seguridad, @respuesta_seguridad, 'operativo');
        SELECT SCOPE_IDENTITY() AS id;
      `);
    return result.recordset[0].id;
  } catch (error) {
    if (error.number === 2627 || error.number === 2601) {
      throw new Error('Ese correo ya está registrado');
    }
    throw error;
  }
};

export const getByEmail = async (correo) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('correo', correo)
    .query('SELECT * FROM usuarios WHERE correo = @correo AND activo = 1');
  return result.recordset[0];
};

export const getActiveUsers = async () => {
  const pool = await getConnection();
  const result = await pool.request().query('SELECT * FROM vw_usuarios_activos');
  return result.recordset;
};

export const getUserById = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', id)
    .query('SELECT * FROM usuarios WHERE id = @id AND activo = 1');
  return result.recordset[0];
};

export const updateUser = async (id, { nombre, correo }) => {
  const pool = await getConnection();
  await pool.request()
    .input('id', id)
    .input('nombre', nombre)
    .input('correo', correo)
    .query(`
      UPDATE usuarios
      SET nombre = @nombre, correo = @correo, fecha_actualizacion = GETDATE()
      WHERE id = @id AND activo = 1
    `);
};

export const updateUserRole = async (id, rol) => {
  const pool = await getConnection();
  await pool.request()
    .input('id', id)
    .input('rol', rol)
    .query(`
      UPDATE usuarios
      SET rol = @rol, fecha_actualizacion = GETDATE()
      WHERE id = @id AND activo = 1
    `);
};

export const softDeleteUser = async (id) => {
  const pool = await getConnection();
  await pool.request()
    .input('id', id)
    .query(`
      UPDATE usuarios
      SET activo = 0, fecha_actualizacion = GETDATE()
      WHERE id = @id
    `);
};