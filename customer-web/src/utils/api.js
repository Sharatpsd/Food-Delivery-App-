import axios from "axios";

/**
 * ✅ VITE environment variable
 * Render / Local — both supported
 */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

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

// ✅ GET restaurants
export const getRestaurants = async ({ category = "", search = "" } = {}) => {
  const params = {};
  if (search) params.search = search;

  const res = await API.get("/restaurants/", { params });
  let data = res.data;

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
  const res = await API.get(`/restaurants/${id}/`);
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
