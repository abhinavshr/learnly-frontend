import Cookies from "js-cookie";

const TOKEN_KEY = "learnly_token";
const TOKEN_EXPIRY_DAYS = 7; // matches your backend's JWT expiresIn: "7d"

export function getToken() {
  return Cookies.get(TOKEN_KEY) || null;
}

export function setToken(token) {
  Cookies.set(TOKEN_KEY, token, {
    expires: TOKEN_EXPIRY_DAYS,
    sameSite: "strict",
    // secure: true, // enable once the app is served over HTTPS (production)
  });
}

export function clearToken() {
  Cookies.remove(TOKEN_KEY);
}