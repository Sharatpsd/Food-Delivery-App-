import axios from "axios";
import sampleRestaurants from "./sampleRestaurants.json";

/**
 * ✅ VITE environment variable
 * Render / Local — both supported
 */
const normalizeApiBase = (baseUrl) => {
  if (!baseUrl) return "http://:8000";
  return baseUrl.endsWith("/api")
    ? baseUrl.slice(0, -"/api".length)
    : baseUrl;
};

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);

/**
 * ✅ Axios instance
 */
const API = axios.create({
  baseURL: `${API_BASE}/api`,
});

/**
 * ✅ Auto attach JWT token
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

export default API;

/* =========================================================
   RESTAURANTS
========================================================= */

const USE_SAMPLE_DATA = Boolean(import.meta.env.DEV);

// ✅ GET restaurants
export const getRestaurants = async ({ category = "", search = "" } = {}) => {
  const params = {};
  if (search) params.search = search;

  let data = [];

  try {
    const res = await API.get("/restaurants/restaurants/", { params });
    data = res.data;
  } catch (error) {
    if (USE_SAMPLE_DATA) {
      console.warn("Falling back to sample restaurants data.", error);
      data = sampleRestaurants;
    } else {
      throw error;
    }
  }

  // Frontend filter (optional)
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
  const res = await API.get(`/restaurants/restaurants/${id}/`);

  return { data: res.data };
};

/* =========================================================
   PARTNER REQUESTS
========================================================= */

// ✅ Restaurant Owner request
export const submitRestaurantOwnerRequest = async (formData) => {
  const res = await API.post("/restaurant-requests/", formData);
  return res.data;
};

// ✅ Delivery Partner request
export const submitDeliveryPartnerRequest = async (formData) => {
  const res = await API.post("/delivery-requests/", formData);
  return res.data;
};

console.log("⚡ Bite API Connected →", `${API_BASE}/api`);
