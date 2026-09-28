import axiosClient from "./axiosClient";

// Iniciar sesión
export const loginUser = (credentials) => {
  return axiosClient.post("/login", credentials);
};

// Crear cuenta nueva
export const registerUser = (userData) => {
  return axiosClient.post("/registro", userData);
};

// Paso 1: buscar la pregunta de seguridad del correo
export const getSecurityQuestion = (correo) => {
  return axiosClient.post("/recuperar/verificar", { correo: correo });
};

// Paso 2: validar la respuesta y cambiar la contraseña
export const resetPassword = (data) => {
  return axiosClient.post("/recuperar/confirmar", data);
};