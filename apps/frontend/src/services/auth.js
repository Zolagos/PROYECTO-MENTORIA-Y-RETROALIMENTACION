import { apiFetch } from "./api";
import { loginWithGoogle } from "./auth.service";
import { saveSession, clearSession } from "../utils/storage";

export async function login() {
  const token = await loginWithGoogle();

  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      token,
    }),
  });

  saveSession(token, response.data);

  return response;
}

export function me() {
  return apiFetch("/auth/me");
}

export function logout() {
  clearSession();

  window.location.hash = "#/login";
}
