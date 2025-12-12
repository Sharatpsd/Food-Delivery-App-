// src/utils/jwt.js
// Small, dependency-free JWT decoder (browser-safe).
export function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payload = parts[1];
    // url-safe base64 -> normal base64
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // add padding
    const pad = b64.length % 4;
    const padded = b64 + (pad ? "=".repeat(4 - pad) : "");

    const decoded = atob(padded);
    // decode percent-encoded UTF-8
    const json = decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (err) {
    console.error("decodeJwt error:", err);
    return null;
  }
}
