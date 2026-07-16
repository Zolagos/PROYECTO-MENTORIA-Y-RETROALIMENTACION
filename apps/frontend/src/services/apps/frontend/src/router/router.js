import { isAuthenticated } from "../utils/storage";

const routes = {
  "/login": renderLogin,
  "/dashboard": renderDashboard,
};

export function navigate(path) {

  if (
    path !== "/login" &&
    !isAuthenticated()
  ) {
    location.hash = "#/login";
    return;
  }

  routes[path]();
}
