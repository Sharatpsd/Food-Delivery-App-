import axios from "axios";

/**
 * Environment Base URL
 * Local → http://localhost:8000
 * Production → from VITE_API_BASE_URL
 */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

/**
 * Axios Instance
 */
const API = axios.create({
  baseURL: `${API_BASE}/api`,
});

/**
 * Auto Attach JWT Token
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   RESTAURANTS
========================================================= */

// Get restaurants
export const getRestaurants = async ({ category = "", search = "" } = {}) => {
  const params = {};
  if (search) params.search = search;

  const res = await API.get("/restaurants/restaurants/", { params });

  let data = res.data;

  if (category) {
    const cat = category.toLowerCase();
    data = data.filter(
      (r) =>
        r.theme?.toLowerCase().includes(cat) ||
        r.must_try?.toLowerCase().includes(cat) ||
        r.city?.toLowerCase().includes(cat)
    );
  }

  return { data };
};

// Get single restaurant
export const getRestaurantDetail = async (id) => {
  const res = await API.get(`/restaurants/restaurants/${id}/`);
  return { data: res.data };
};

/* =========================================================
   PARTNER REQUESTS
========================================================= */

// Restaurant Owner request
export const submitRestaurantOwnerRequest = async (formData) => {
  const res = await API.post("/restaurant-requests/", formData);
  return res.data;
};

// Delivery Partner request
export const submitDeliveryPartnerRequest = async (formData) => {
  const res = await API.post("/delivery-requests/", formData);
  return res.data;
};

console.log("⚡ Bite API Connected →", `${API_BASE}/api`);

export default API;
