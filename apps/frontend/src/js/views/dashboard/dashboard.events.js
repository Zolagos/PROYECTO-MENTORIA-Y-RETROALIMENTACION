import { logout } from "../../../services/auth.js";

export function registerDashboardEvents() {
  const button = document.getElementById("logout-btn");

  if (!button) return;

  button.addEventListener("click", logout);
}
