import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api", // Cambia esto por la URL real de la API de tu compañero
});

// Agrega el token JWT automáticamente a cada petición
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = 'Bearer ${token}';
  }
  return config;
});

export default axiosClient;