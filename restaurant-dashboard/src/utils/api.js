import axiosClient from "./axiosClient";

export const API = {
  // Auth
  login: (data) => axiosClient.post("/auth/token/", data),
  getUser: () => axiosClient.get("/auth/user/"),

  // Restaurant
  getMyRestaurant: () => axiosClient.get("/restaurants/my-restaurant/"),
  createRestaurant: (data) =>
    axiosClient.post("/restaurants/create/", data),

  // Orders
  getRestaurantOrders: () =>
    axiosClient.get("/orders/restaurant-orders/"),

  updateOrderStatus: (id, status) =>
    axiosClient.patch(`/orders/${id}/update-status/`, { status }),
};
