import "./login.css";

export function renderLogin() {
  return `
    <main class="login-container">

      <h1>Proyecto Mentorías</h1>

      <p>Autenticación con Firebase</p>

      <button id="google-login-btn">
        Iniciar sesión con Google
      </button>

    </main>
  `;
}
