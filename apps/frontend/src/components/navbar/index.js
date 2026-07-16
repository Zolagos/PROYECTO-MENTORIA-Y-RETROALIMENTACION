import { getUser } from "../../utils/storage.js";

export function Navbar() {
  const user = getUser();

  return `
    <header class="navbar">

      <h2>Proyecto Mentorías</h2>

      <div class="navbar-user">

        <span>${user?.email ?? ""}</span>

      </div>

    </header>
  `;
}
