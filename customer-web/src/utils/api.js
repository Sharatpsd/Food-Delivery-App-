import axiosClient from "./axiosClient";

export const getRestaurants = (params) =>
  axiosClient.get("/restaurants/", { params });

export const getRestaurantDetail = (id) =>
  axiosClient.get(`/restaurants/${id}/`);
