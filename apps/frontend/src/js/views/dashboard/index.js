import { Layout } from "../../../components/layout/index.js";
import { Card } from "../../../components/card/index.js";
import { getUser } from "../../../utils/storage.js";

export function renderDashboard() {

    const user = getUser();

    return Layout(`

        <h1>
            Bienvenido
        </h1>

        <p>${user.email}</p>

        <section class="cards">

            ${Card("Usuarios","25")}

            ${Card("Mentorías","12")}

            ${Card("Tutores","6")}

            ${Card("Coders","42")}

        </section>

        <button id="logout-btn">
            Cerrar sesión
        </button>

    `);

}
