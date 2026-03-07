import axios from "axios";
import sampleRestaurants from "./sampleRestaurants.json";

/**
 * ✅ VITE environment variable
 * Render / Local — both supported
 */
const normalizeApiBase = (baseUrl) => {
  if (!baseUrl) return "http://localhost:8000";
  const trimmed = baseUrl.replace(/\/$/, "");
  return trimmed.endsWith("/api")
    ? trimmed.slice(0, -"/api".length)
    : trimmed;
};

const LOCAL_BASE = "http://127.0.0.1:8000";
const RENDER_BASE = "https://food-delivery-app-1-ihcm.onrender.com";
const DEFAULT_BASE = import.meta.env.PROD ? RENDER_BASE : LOCAL_BASE;
const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE);

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

let refreshPromise = null;

const clearSessionAndRedirect = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const shouldSkipRefresh = (url = "") =>
  url.includes("/auth/token/") ||
  url.includes("/auth/token/refresh/") ||
  url.includes("/auth/register/") ||
  url.includes("/auth/google/");

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      throw new Error("Refresh token missing");
    }

    refreshPromise = axios
      .post(`${API_BASE}/api/auth/token/refresh/`, { refresh })
      .then((res) => {
        const nextAccess = res.data?.access;
        if (!nextAccess) {
          throw new Error("Access token missing in refresh response");
        }
        localStorage.setItem("access", nextAccess);
        return nextAccess;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(requestUrl)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const nextAccess = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${nextAccess}`;
      return API(originalRequest);
    } catch (refreshError) {
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    }
  }
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
