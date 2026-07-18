export function renderLogin() {
  return `
    <section class="login-page">

      <div class="login-left">

        <img
          class="riwi-logo"
          src="/src/assets/riwi-logo.png"
          alt="Riwi"
        />

        <h1>TutorCode</h1>

        <h2>
          Plataforma de Mentorías
        </h2>

        <p>
          Gestiona mentorías, agenda sesiones y fortalece el aprendizaje
          colaborativo entre Team Leaders, Tutores y Coders.
        </p>

      </div>

      <div class="login-right">

        <div class="login-card">

          <h2>Bienvenido</h2>

          <p class="subtitle">
            Inicia sesión para continuar.
          </p>

          <form>

            <label>Email</label>

            <input
              type="email"
              placeholder="correo@riwi.io"
              disabled
            />

            <label>Contraseña</label>

            <input
              type="password"
              placeholder="********"
              disabled
            />

            <button
              type="button"
              class="disabled-btn"
              disabled
            >
              Próximamente
            </button>

          </form>

          <div class="divider">
            <span>o continúa con</span>
          </div>

          <button
            id="google-login-btn"
            class="google-btn"
          >

            <img
              src="/src/assets/google-icon-logo-svgrepo-com.svg"
              alt="Google"
            />

            <span>Continuar con Google</span>

          </button>

        </div>

      </div>

    </section>
  `;
}
