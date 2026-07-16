import { login } from "../../../services/auth.js";

export function registerLoginEvents() {
  const button = document.getElementById("google-login-btn");

  if (!button) return;

  button.addEventListener("click", async () => {
    try {
      const response = await login();

      console.log(response);

      alert("Login correcto");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}
