import { apiFetch } from "./api";
import { loginWithGoogle } from "./auth.service";

export async function login() {
  const token = await loginWithGoogle();

  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      token,
    }),
  });
}
