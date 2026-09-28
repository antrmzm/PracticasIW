import axiosClient from "./axiosClient";

// Obtener todos los usuarios activos
export const getUsers = () => {
  return axiosClient.get("/usuarios");
};

// Actualizar un usuario
export const updateUser = (id, data) => {
  return axiosClient.put("/usuarios/" + id, data);
};

// Eliminar (lógicamente) un usuario
export const deleteUser = (id) => {
  return axiosClient.delete("/usuarios/" + id);
};