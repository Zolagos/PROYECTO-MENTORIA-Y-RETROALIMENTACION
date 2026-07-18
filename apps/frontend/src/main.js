import { navigate } from "./router/router.js";
import { isAuthenticated, saveSession } from "./utils/storage.js";
import { apiFetch } from "./services/api.js";
import { handleRedirectLogin } from "./services/auth.service.js";

import "./assets/styles.css";

if (!location.hash) {
  location.hash = isAuthenticated()
    ? "#/dashboard"
    : "#/login";
}

(async () => {
  const token = await handleRedirectLogin();

  if (token) {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    saveSession(token, response.data);

    location.hash = "#/dashboard";
  }

  navigate();
})();

window.addEventListener("hashchange", navigate);
