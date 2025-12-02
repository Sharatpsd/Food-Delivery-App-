export const API_URL = "http://127.0.0.1:8000";

export const CUSTOMER_ENDPOINTS = {
  LOGIN: "/api/auth/token/",
  RESTAURANTS: "/api/restaurants/",
  FOODS: "/api/foods/",
  CREATE_ORDER: "/api/orders/create/",
  MY_ORDERS: "/api/orders/my-orders/",
};

export const RESTAURANT_ENDPOINTS = {
  LOGIN: "/api/auth/token/",
  MY_RESTAURANT: "/api/restaurants/my-restaurant/",
  ORDERS: "/api/orders/restaurant-orders/",
  UPDATE_STATUS: "/api/orders/update-status/",
};
