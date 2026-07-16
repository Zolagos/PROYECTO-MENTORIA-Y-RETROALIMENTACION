import { logout } from "../../../services/auth.js";

/* Registrar interacciones básicas del panel numérico */
export function registerDashboardEvents() {
    const button = document.getElementById("logout-btn");

    if (!button) return;

    button.addEventListener("click", logout);
}