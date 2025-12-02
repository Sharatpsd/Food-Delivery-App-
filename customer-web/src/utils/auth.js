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
}
