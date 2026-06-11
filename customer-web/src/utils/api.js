import axios from "axios";
import { logout, getToken } from "./auth";

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

const requestAllPublicPages = async (path, config = {}) => {
  const firstResponse = await requestPublicWithFallback(path, config);
  const firstData = firstResponse.data;

  if (!Array.isArray(firstData?.results) || !firstData?.next) {
    return firstResponse;
  }

  const allResults = [...firstData.results];
  let nextUrl = firstData.next;

  while (nextUrl) {
    const response = await axios.get(nextUrl, { timeout: 12000 });
    const pageData = response.data;

    if (Array.isArray(pageData?.results)) {
      allResults.push(...pageData.results);
    }

    nextUrl = pageData?.next || null;
  }

  return {
    ...firstResponse,
    data: {
      ...firstData,
      results: allResults,
      next: null,
      previous: null,
    },
  };
};

const unwrapListData = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const dedupeRestaurants = (restaurants = []) => {
  const seen = new Map();

  restaurants.forEach((restaurant) => {
    const key = String(restaurant?.name || "").trim().toLowerCase();
    if (!key) return;

    const current = seen.get(key);
    const currentFoodCount = Number(current?.food_count || 0);
    const nextFoodCount = Number(restaurant?.food_count || 0);

    if (!current || nextFoodCount > currentFoodCount) {
      seen.set(key, restaurant);
    }
  });

  return [...seen.values()];
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
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise = null;

const clearSessionAndRedirect = () => {
  logout();
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
      .catch((err) => {
        // Refresh token is also expired or invalid
        clearSessionAndRedirect();
        throw err;
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

    // Handle 401 with token refresh attempt
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(requestUrl)
    ) {
      originalRequest._retry = true;

      try {
        const nextAccess = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${nextAccess}`;
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Handle other 401 or no refresh needed
    if (status === 401) {
      clearSessionAndRedirect();
    }

    return Promise.reject(error);
  }
);

/*
=/*
===============================
RESTAURANTS
===============================
*/

export const getRestaurants = async ({ category = "", search = "" } = {}) => {
  const params = {};
  if (search) params.search = search;

  const res = await requestAllPublicPages("/restaurants/", {
    params,
  });

  let data = unwrapListData(res.data);

  // Remove duplicates only
  data = dedupeRestaurants(data);

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
  const res = await requestPublicWithFallback(`/restaurants/${id}/`);
  return { data: res.data };
};

export const getRestaurantFoods = async (restaurantId) => {
  const res = await requestAllPublicPages(`/restaurants/foods/`, {
    params: { restaurant: restaurantId },
  });

  return { data: unwrapListData(res.data) };
};
/*
===============================
CART
===============================
*/

export const getCart = async () => {
  const res = await API.get("/orders/cart/");
  return res.data;
};

export const addCartItem = async ({ foodId, quantity = 1 }) => {
  const res = await API.post("/orders/cart/add/", {
    food_id: foodId,
    quantity,
  });
  return res.data;
};

export const updateCartItem = async ({ cartItemId, quantity }) => {
  const res = await API.patch(`/orders/cart/items/${cartItemId}/`, {
    quantity,
  });
  return res.data;
};

export const removeCartItem = async (cartItemId) => {
  const res = await API.delete(`/orders/cart/items/${cartItemId}/`);
  return res.data;
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

