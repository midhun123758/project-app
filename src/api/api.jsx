// src/api.js
import axios from "axios";

const API_BASE = "https://monarch-app.ddns.net/api";

// Generic request helper
const request = (method, url, data = null, token = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios({
    method,
    url: `${API_BASE}${url}`,
    data,
    headers,
  });
};

// ---------------- AUTH ----------------
export const auth = {
  register: (username, email, password) =>
    request("post", "/users/register/", { username, email, password }),

  login: (email, password) =>
    request("post", "/users/login/", { email, password }),

  logout: (token) =>
    request(
      "post",
      "/users/logout/",
      { refresh: localStorage.getItem("refresh") },
      token
    ),

  me: (token) => request("get", "/users/auth/me/", null, token),

  sendOtp: (email) => request("post", "/users/forgot-password/", { email }),
  verifyOtp: (email, otp) =>
    request("post", "/users/verify-otp/", { email, otp }),
  resetPassword: (email, password) =>
    request("post", "/users/reset-password/", { email, password }),
};

// ---------------- CART ----------------
export const cart = {
  getCart: (token) => request("get", "/cart/view/", null, token),
  addItem: (productId, quantity, token) =>
    request("post", "/cart/add/", { product_id: productId, quantity }, token),
  updateItem: (itemId, quantity, token) =>
    request("put", `/cart/update/${itemId}/`, { quantity }, token),
  removeItem: (itemId, token) =>
    request("delete", `/cart/delete/${itemId}/`, null, token),
};

// ---------------- PRODUCTS ----------------
export const products = {
  list: () => request("get", "/products/"),
  detail: (id) => request("get", `/products/${id}/`),
};

// ---------------- WISHLIST ----------------
export const wishlist = {
  // Get all wishlist items for the user
  getWishlist: (token) => request("get", "/wishlist/wishlist_View/", null, token),

  // Toggle a product in the wishlist (add/remove)
  addToWishlist: (productId, token) =>
    request("post", "/wishlist/wishlist_add/", { product_id: productId }, token),

  // Remove a wishlist item by its ID
  removeItem: (itemId, token) =>
    request("delete", `/wishlist/delete/${itemId}/`, null, token),
};