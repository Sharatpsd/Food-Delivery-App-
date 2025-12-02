// src/utils/api.js

import axiosClient from "./axiosClient";

export const API = {
  // Auth
  login: (data) => axiosClient.post("/api/auth/token/", data),
  getUser: () => axiosClient.get("/api/auth/user/"),

  // Restaurant
  getMyRestaurant: () => axiosClient.get("/api/restaurants/my-restaurant/"),
  createRestaurant: (data) =>
    axiosClient.post("/api/restaurants/create/", data),

  // Orders
  getRestaurantOrders: () =>
    axiosClient.get("/api/orders/restaurant-orders/"),

  updateOrderStatus: (id, status) =>
    axiosClient.patch(`/api/orders/${id}/update-status/`, { status }),
};
