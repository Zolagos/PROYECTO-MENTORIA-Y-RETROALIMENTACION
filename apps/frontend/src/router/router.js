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
