import { navigate } from "./router/router.js";
import { isAuthenticated } from "./utils/storage.js";
import "./assets/styles.css";

if (!location.hash) {
    location.hash = isAuthenticated()
        ? "#/dashboard"
        : "#/login";
}

window.addEventListener("DOMContentLoaded", navigate);
window.addEventListener("hashchange", navigate);
