// import axiosClient from "./axiosClient";
// import sampleRestaurants from "./sampleRestaurants.json";

// export const API = {
//   // Auth
//   login: (data) => axiosClient.post("/auth/token/", data),
//   getUser: () => axiosClient.get("/auth/user/"),

//   // Restaurant
//   getRestaurants: () => axiosClient.get("/restaurants/"),
//   getMyRestaurant: () => axiosClient.get("/restaurants/my-restaurant/"),
//   createRestaurant: (data) =>
//     axiosClient.post("/restaurants/create/", data),

//   // Orders
//   getRestaurantOrders: () =>
//     axiosClient.get("/orders/restaurant-orders/"),

//   updateOrderStatus: (id, status) =>
//     axiosClient.patch(`/orders/${id}/update-status/`, { status }),
// };
import axios from "axios";
import sampleRestaurants from "./sampleRestaurants.json";

/**
 * Base URL (Render / Local)
 * Render env MUST be: https://food-delivery-app-1-ihcm.onrender.com
 */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Axios instance
 * NOTE: /api only once
 */
const API = axios.create({
  baseURL: `${API_BASE}/api`,
});

/**
 * Auto attach JWT
 */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

/* =========================================================
   RESTAURANTS
========================================================= */

const USE_SAMPLE_DATA = import.meta.env.DEV === true;

// ✅ GET restaurants (SAFE + CLEAN)
export const getRestaurants = async ({ category = "", search = "" } = {}) => {
  const params = {};
  if (search) params.search = search;

  let data = [];

  try {
    const res = await API.get("/restaurants/", { params });
    data = res.data;
  } catch (error) {
    if (USE_SAMPLE_DATA) {
      console.warn("Backend error → using sample data");
      data = sampleRestaurants;
    } else {
      throw error;
    }
  }

  // Optional frontend filtering
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

// ✅ GET single restaurant
export const getRestaurantDetail = async (id) => {
  const res = await API.get(`/restaurants/${id}/`);
  return { data: res.data };
};
