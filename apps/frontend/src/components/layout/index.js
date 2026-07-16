import { Navbar } from "../navbar/index.js";
import { Sidebar } from "../sidebar/index.js";

export function Layout(content) {

    return `
        ${Navbar()}

        <div class="app-layout">

            ${Sidebar()}

            <main class="content">
                ${content}
            </main>

        </div>
    `;
}
