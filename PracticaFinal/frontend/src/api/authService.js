import axiosClient from "./axiosClient";

export const loginUser = (credentials) => {
  return axiosClient.post("/auth/login", credentials);
};

export const registerUser = (userData) => {
  return axiosClient.post("/auth/register", userData);
};

// Paso 1: buscar la pregunta de seguridad del correo
export const getSecurityQuestion = (email) => {
  return axiosClient.post("/auth/security-question", { email });
};

// Paso 2: validar la respuesta y cambiar la contraseña
export const resetPassword = (data) => {
  return axiosClient.post("/auth/reset-password", data);
};