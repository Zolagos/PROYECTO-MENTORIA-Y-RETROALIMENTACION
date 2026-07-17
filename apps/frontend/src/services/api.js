import { getToken } from "../utils/storage";

const API_URL =
    import.meta.env.VITE_API_URL ??
    "http://localhost:3000/api";

export async function apiFetch(endpoint, options = {}) {

    const token = getToken();

    const response = await fetch(`${API_URL}${endpoint}`, {

        ...options,

        headers: {
            "Content-Type":"application/json",

            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),

            ...(options.headers || {})
        }

    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message);
    }

    return data;
}
