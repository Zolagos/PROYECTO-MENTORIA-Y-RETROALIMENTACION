/* router */

import renderMentoring from "../js/views/mentoring/mentoring.events.js";

const routes = {
    "/": renderMentoring,
    "/mentoring": renderMentoring
};

/* navigate between views */

function router() {
    const path = window.location.pathname;

    const view = routes[path];

    if (view) {
        view();
        return;
    }

    document.getElementById("app").innerHTML = `
        <h2>404 - Page not found</h2>
    `;
}

/* change route */

function navigate(path) {
    window.history.pushState({}, "", path);
    router();
}

window.addEventListener("popstate", router);

export {
    router,
    navigate
};

// Roberto's code

import { renderLogin } from "../js/views/login/index.js";
import { renderDashboard } from "../js/views/dashboard/index.js";
import { renderNotFound } from "../js/views/notFound/index.js";
import { getToken } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {

    const token = getToken();

    const response = await fetch(`${API_URL}${endpoint}`, {

        headers: {
            "Content-Type": "application/json",

            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),

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
