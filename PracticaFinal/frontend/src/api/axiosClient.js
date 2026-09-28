import axios from "axios";

// URL de producción del backend (Render)
const axiosClient = axios.create({
  baseURL: "https://practica-final-api.onrender.com/api",
});

// Agrega el token JWT automáticamente a cada petición
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default axiosClient;