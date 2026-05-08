import axios from "axios";

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
export const API_BASE = normalizeApiBase(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE
);

const API = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 45000,
});

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

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const requestAllPages = async (path, config = {}) => {
  const firstResponse = await API.get(path, config);
  const firstData = firstResponse.data;

  if (!Array.isArray(firstData?.results) || !firstData?.next) {
    return normalizeList(firstData);
  }

  const allItems = [...firstData.results];
  let nextUrl = firstData.next;

  while (nextUrl) {
    const response = await API.get(nextUrl);
    const pageData = response.data;
    allItems.push(...normalizeList(pageData));
    nextUrl = pageData?.next || null;
  }

  return allItems;
};

export const resolveMediaUrl = (value) => {
  if (!value) return null;
  const source = String(value).trim();
  if (source.startsWith("http://127.0.0.1:8000") || source.startsWith("http://localhost:8000")) {
    return source.replace(/^http:\/\/(127\.0\.0\.1|localhost):8000/i, API_BASE);
  }
  if (source.startsWith("http://") || source.startsWith("https://")) return source;
  if (source.startsWith("/")) return `${API_BASE}${source}`;
  return `${API_BASE}/${source}`;
};

export const formatCurrency = (amount) =>
  `৳${Math.round(Number(amount || 0)).toLocaleString()}`;

export const getCurrentUser = async () => {
  const res = await API.get("/auth/user/");
  return res.data;
};

export const getOwnedRestaurants = async () => {
  const [user, restaurants] = await Promise.all([
    getCurrentUser(),
    requestAllPages("/restaurants/restaurants/"),
  ]);

  const ownedRestaurants = restaurants
    .filter((restaurant) => Number(restaurant.owner) === Number(user.id))
    .filter((restaurant) => !String(restaurant.name || "").includes("(Archived #)"))
    .sort((a, b) => Number(b.is_active) - Number(a.is_active) || a.id - b.id);

  return { user, restaurants: ownedRestaurants };
};

export const getRestaurantMenu = async (restaurantId) => {
  if (!restaurantId) return [];
  return requestAllPages("/restaurants/foods/", {
    params: { restaurant: restaurantId },
  });
};

export const getPartnerRestaurantBundle = async () => {
  const { user, restaurants } = await getOwnedRestaurants();
  const primaryRestaurant = restaurants[0] || null;

  if (!primaryRestaurant) {
    return { user, restaurant: null, foods: [] };
  }

  const [detailResponse, foods] = await Promise.all([
    API.get(`/restaurants/${primaryRestaurant.id}/`),
    getRestaurantMenu(primaryRestaurant.id),
  ]);

  return {
    user,
    restaurant: { ...primaryRestaurant, ...detailResponse.data },
    foods,
  };
};

export const getRestaurantOrders = async () => {
  const res = await API.get("/orders/restaurant-orders/");
  return normalizeList(res.data);
};

export const updateRestaurantOrderStatus = async (orderId, status) => {
  const res = await API.post(`/orders/${orderId}/update-status/`, { status });
  return res.data;
};

export default API;
