import axios from "axios";

const api = axios.create({
  baseURL: "https://food-delivery-app-1-ihcm.onrender.com/api",
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
