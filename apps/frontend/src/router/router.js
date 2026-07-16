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