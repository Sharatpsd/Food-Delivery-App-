import axios from "axios";

/*
===============================
API BASE URL
===============================
Local → http://localhost:8000
Production → VITE_API_BASE_URL
*/

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

/*
===============================
AXIOS INSTANCE
===============================
*/

const API = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
});

/*
===============================
AUTO JWT TOKEN ATTACH
===============================
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

/*
===============================
RESTAURANTS
===============================
*/

// Get all restaurants
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

// ⭐ Get foods of restaurant
export const getRestaurantFoods = async (restaurantId) => {
  const res = await API.get(`/restaurants/foods/?restaurant=${restaurantId}`);
  return { data: res.data };
};

/*
===============================
PARTNER REQUESTS
===============================
*/

// Restaurant owner request
export const submitRestaurantOwnerRequest = async (formData) => {
  const res = await API.post("/restaurant-requests/", formData);
  return res.data;
};

// Delivery partner request
export const submitDeliveryPartnerRequest = async (formData) => {
  const res = await API.post("/delivery-requests/", formData);
  return res.data;
};

console.log("⚡ Bite API Connected →", `${API_BASE}/api`);

export default API;