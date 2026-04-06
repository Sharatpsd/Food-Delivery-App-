import { jwtDecode } from "jwt-decode";

export function getToken() {
  return localStorage.getItem("access");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

export function setToken(access, refresh) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
}

/**
 * Check if token is expired
 * @param {string} token JWT token
 * @returns {boolean} true if expired
 */
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

/**
 * Check if user is authenticated and has valid token
 * @returns {boolean} true if authenticated
 */
export function isAuthenticated() {
  const token = getToken();
  return token && !isTokenExpired(token);
}

/**
 * Get time until token expiration in seconds
 * @param {string} token JWT token
 * @returns {number} seconds until expiration
 */
export function getTokenExpireTime(token) {
  if (!token) return 0;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp - currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return 0;
  }
}

