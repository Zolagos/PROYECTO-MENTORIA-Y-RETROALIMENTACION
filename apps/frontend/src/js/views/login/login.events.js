import { login } from "../../../services/auth.js";

export function registerLoginEvents() {
  const button = document.getElementById("google-login-btn");

  if (!button) return;
  button.addEventListener("click", async () => {
    try {
      await login();

     location.hash = "#/dashboard";

    }   catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}
