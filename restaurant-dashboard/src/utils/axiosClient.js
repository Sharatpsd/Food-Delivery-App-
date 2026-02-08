// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: "http://127.0.0.1:8000",
// });

// // Add Access Token
// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Auto Logout if Token Invalid
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem("access");
//       localStorage.removeItem("refresh");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosClient;
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add Access Token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto Logout if Token Invalid
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
