import axios from "axios";

/*
===============================
API BASE URL
===============================
Local -> http://localhost:8000
Production -> VITE_API_BASE_URL
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

const buildApiBaseCandidates = () => {
  const ordered = import.meta.env.PROD
    ? [API_BASE, RENDER_BASE]
    : [API_BASE, LOCAL_BASE, RENDER_BASE];
  return [...new Set(ordered.map(normalizeApiBase))];
};

const requestPublicWithFallback = async (path, config = {}) => {
  const candidates = buildApiBaseCandidates();
  let lastError = null;

  for (const base of candidates) {
    try {
      return await axios.get(`${base}/api${path}`, {
        timeout: 12000,
        ...config,
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("No API base available");
};

/*
===============================
AXIOS INSTANCE
===============================
*/

const API = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 45000,
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

let refreshPromise = null;

const clearSessionAndRedirect = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  if (
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/register"
  ) {
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

/*
===============================
RESTAURANTS
===============================
*/

export const getRestaurants = async ({ category = "", search = "" } = {}) => {
  const params = {};
  if (search) params.search = search;

  const res = await requestPublicWithFallback("/restaurants/restaurants/", {
    params,
  });

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

export const getRestaurantDetail = async (id) => {
  const res = await requestPublicWithFallback(`/restaurants/restaurants/${id}/`);
  return { data: res.data };
};

export const getRestaurantFoods = async (restaurantId) => {
  const res = await requestPublicWithFallback(`/restaurants/foods/`, {
    params: { restaurant: restaurantId },
  });

  return { data: res.data };
};

/*
===============================
PARTNER REQUESTS
===============================
*/

export const submitRestaurantOwnerRequest = async (formData) => {
  const res = await API.post("/restaurant-requests/", formData);
  return res.data;
};

export const submitDeliveryPartnerRequest = async (formData) => {
  const res = await API.post("/delivery-requests/", formData);
  return res.data;
};

console.log("Bite API Connected ->", `${API_BASE}/api`);

export default API;
