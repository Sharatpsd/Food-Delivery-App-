import axios from "axios";
import { getToken, clearToken } from "./auth";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
