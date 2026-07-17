import { renderLogin } from "../js/views/login/index.js";
import { renderDashboard } from "../js/views/dashboard/index.js";
import { renderNotFound } from "../js/views/notFound/index.js";
import { isAuthenticated } from "../utils/storage.js";

const app = document.querySelector("#app");

const routes = {
  "/login": renderLogin,
  "/dashboard": renderDashboard,
};

export function navigate() {
  const path = location.hash.replace("#", "") || "/login";

  if (path !== "/login" && !isAuthenticated()) {
    location.hash = "#/login";
    return;
  }

  const view = routes[path] || renderNotFound;

  app.innerHTML = view();

  if (path === "/login") {
    import("../js/views/login/login.events.js").then(
      ({ registerLoginEvents }) => registerLoginEvents()
    );
  }

  if (path === "/dashboard") {
    import("../js/views/dashboard/dashboard.events.js").then(
      ({ registerDashboardEvents }) => registerDashboardEvents()
    );
  }
}
