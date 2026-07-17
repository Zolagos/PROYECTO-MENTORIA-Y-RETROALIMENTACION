/* mentoring events */

import mentoringView from "./mentoring.view.js";
import { getSessionById, createSession, updateSession, deleteSession } from "../../../services/mentoring.service.js";

/* render mentoring view */

function renderMentoring() {
    const app = document.getElementById("app");

    app.innerHTML = mentoringView();

    registerEvents();
}

/* register events */

function registerEvents() {
    registerFormEvent();
    registerDeleteEvents();
    registerEditEvents();
    registerModalityEvent();
}

/* create session */

function registerFormEvent() {
    const form = document.getElementById("mentoring-form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const topic = document.getElementById("topic").value.trim();
        const description = document.getElementById("description").value.trim();
        const tutor_id = Number(document.getElementById("tutor").value);

        const session_date = document.getElementById("session-date").value;
        const start_time = document.getElementById("start-time").value;
        const end_time = document.getElementById("end-time").value;

        const modality = document.getElementById("modality").value;
        const room = document.getElementById("room").value.trim();
        const meeting_link = document.getElementById("meeting-link").value.trim();

        if (!topic || !description || !tutor_id) {
            alert("Complete all required fields.");
            return;
        }

        if (!session_date || !start_time || !end_time || !modality) {
            alert("Complete the session information.");
            return;
        }

        if (modality === "in-person" && !room) {
            alert("Room is required.");
            return;
        }

        if (modality === "virtual" && !meeting_link) {
            alert("Meeting link is required.");
            return;
        }

        const sessionId = Number(document.getElementById("session-id").value);

        const session = {
            id: sessionId,
            topic,
            description,
            tutor_id,
            session_date,
            start_time,
            end_time,
            modality,
            room,
            meeting_link,
            status: "scheduled"
        };

        if (sessionId) {
            updateSession(session);
        } else {
            createSession(session);
        }

        form.reset();
        document.getElementById("session-id").value = "";

        renderMentoring();
    });
}

/* delete session */

function registerDeleteEvents() {
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);

            const confirmDelete = confirm("Delete this mentoring session?");

            if (!confirmDelete) {
                return;
            }

            deleteSession(id);

            renderMentoring();
        });
    });
}

/* edit session */

function registerEditEvents() {
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);

            const session = getSessionById(id);

            document.getElementById("session-id").value = session.id;
            document.getElementById("topic").value = session.topic;
            document.getElementById("description").value = session.description;
            document.getElementById("tutor").value = session.tutor_id;

            document.getElementById("session-date").value = session.session_date;
            document.getElementById("start-time").value = session.start_time;
            document.getElementById("end-time").value = session.end_time;

            document.getElementById("modality").value = session.modality;
            document.getElementById("room").value = session.room;
            document.getElementById("meeting-link").value = session.meeting_link;

            /* trigger modality validation */
            document.getElementById("modality").dispatchEvent(new Event("change"));
        });
    });
}

export default renderMentoring;

/* validate modality */

function registerModalityEvent() {
    const modality = document.getElementById("modality");
    const room = document.getElementById("room");
    const meetingLink = document.getElementById("meeting-link");

    modality.addEventListener("change", () => {
        if (modality.value === "in-person") {
            room.disabled = false;
            meetingLink.disabled = true;
            meetingLink.value = "";
        }

        if (modality.value === "virtual") {
            meetingLink.disabled = false;
            room.disabled = true;
            room.value = "";
        }

        if (modality.value === "") {
            room.disabled = false;
            meetingLink.disabled = false;
        }
    });
}