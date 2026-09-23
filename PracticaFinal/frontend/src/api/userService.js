import axiosClient from "./axiosClient";

// Obtener todos los usuarios (solo activos, gracias al soft delete)
export const getUsers = () => {
  return axiosClient.get("/users");
};

// Actualizar un usuario
export const updateUser = (id, data) => {
  return axiosClient.put("/users/" + id, data);
};

// Eliminar (lógicamente) un usuario
export const deleteUser = (id) => {
  return axiosClient.delete("/users/" + id);
};