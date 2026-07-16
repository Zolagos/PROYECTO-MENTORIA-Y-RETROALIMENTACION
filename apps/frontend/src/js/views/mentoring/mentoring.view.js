/* mentoring view */

import { getSessions } from "../../../services/mentoring.service.js";
import tutorsMock from "../../mocks/tutors.mock.js";

function mentoringView() {
    const sessions = getSessions();

    let tutorOptions = "";

    tutorsMock.forEach((tutor) => {
        tutorOptions += `
            <option value="${tutor.id}">
                ${tutor.name} ${tutor.lastname}
            </option>
        `;
    });

    let rows = "";

    sessions.forEach((session) => {
        const tutor = tutorsMock.find(
            (item) => item.id === session.tutor_id
        );

        rows += `
            <tr>
                <td>${session.topic}</td>
                <td>${tutor ? `${tutor.name} ${tutor.lastname}` : "-"}</td>
                <td>${session.session_date}</td>
                <td>${session.start_time}</td>
                <td>${session.end_time}</td>
                <td>${session.modality}</td>
                <td>${session.status}</td>
                <td>
                    <button class="edit-btn" data-id="${session.id}">
                        Edit
                    </button>

                    <button class="delete-btn" data-id="${session.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    return `
        <section class="mentoring">

            <h2>Group Mentoring Sessions</h2>

            <form id="mentoring-form">

                <input type="hidden" id="session-id">

                <input type="text" id="topic" placeholder="Topic">

                <textarea id="description" placeholder="Description"></textarea>

                <select id="tutor">
                    <option value="">
                        Select tutor
                    </option>

                    ${tutorOptions}
                </select>

                <!-- session date -->

                <input type="date" id="session-date">

                <!-- start time -->

                <input type="time" id="start-time">

                <!-- end time -->

                <input type="time" id="end-time">

                <!-- modality -->

                <select id="modality">

                    <option value="">
                        Select modality
                    </option>

                    <option value="in-person">
                        In-person
                    </option>

                    <option value="virtual">
                        Virtual
                    </option>

                </select>

                <!-- room -->

                <input type="text" id="room" placeholder="Room">

                <!-- meeting link -->

                <input type="url" id="meeting-link" placeholder="Meeting link">

                <button type="submit">
                    Save
                </button>

            </form>

            <table>

                <thead>
                    <tr>
                        <th>Topic</th>
                        <th>Tutor</th>
                        <th>Date</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Modality</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    ${rows}
                </tbody>

            </table>

        </section>
    `;
}

export default mentoringView;