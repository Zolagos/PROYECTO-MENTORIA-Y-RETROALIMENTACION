import { renderDashboard } from "../js/views/dashboard/index.js";
import renderMentoring from "../js/views/mentoring/mentoring.events.js";
import { renderLogin } from "../js/views/login/index.js";
import { renderNotFound } from "../js/views/notFound/index.js";
import { getToken } from "../utils/storage.js";

// Mapeo unificado adaptado al sistema de Hashes de la aplicación
const routes = {
    "": renderLogin,
    "#/": renderLogin,
    "#/login": renderLogin,
    "#/dashboard": renderDashboard, 
    "#/mentoring": renderMentoring
};

/* navigate between views */
export function router() {
    // CORRECCIÓN: Leemos el hash (ej: "#/dashboard") para que coincida con las llaves de arriba
    const path = window.location.hash;
    const view = routes[path];

    if (view) {
        view();
        return;
    }

    if (typeof renderNotFound === "function") {
        renderNotFound();
    } else {
        document.getElementById("app").innerHTML = `<h2>404 - Page not found</h2>`;
    }
}

/* change route */
export function navigate() {
    router();
}

window.addEventListener("popstate", router);

// Roberto's code (Cliente API HTTP centralizado)
const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
    const token = getToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}
