import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Send token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;   // ⭐ THIS FIXES YOUR ERROR

// ---------------------------------------------------------
// GET RESTAURANTS LIST
// ---------------------------------------------------------
export const getRestaurants = async ({ category = "", search = "" } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const res = await fetch(`${API.defaults.baseURL}/restaurants/?${params.toString()}`);

  if (!res.ok) throw new Error("Failed to fetch restaurants");

  const data = await res.json();

  if (category) {
    const cat = category.toLowerCase();
    return {
      data: data.filter(
        (r) =>
          (r.theme && r.theme.toLowerCase().includes(cat)) ||
          (r.must_try && r.must_try.toLowerCase().includes(cat)) ||
          (r.city && r.city.toLowerCase().includes(cat))
      ),
    };
  }

  return { data };
};

// ---------------------------------------------------------
// GET SINGLE RESTAURANT
// ---------------------------------------------------------
export const getRestaurantDetail = async (id) => {
  const res = await fetch(`${API.defaults.baseURL}/restaurants/${id}/`);
  if (!res.ok) throw new Error("Restaurant not found");
  return { data: await res.json() };
};

// ---------------------------------------------------------
// OWNER REQUEST
// ---------------------------------------------------------
export const submitRestaurantOwnerRequest = async (formData) => {
  const res = await fetch(`${API.defaults.baseURL}/restaurant-requests/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Request failed");
  return await res.json();
};

// ---------------------------------------------------------
// DELIVERY REQUEST
// ---------------------------------------------------------
export const submitDeliveryPartnerRequest = async (formData) => {
  const res = await fetch(`${API.defaults.baseURL}/delivery-requests/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Request failed");
  return await res.json();
};

console.log("⚡ Bite API Connected →", API.defaults.baseURL);
