/* mentoring service */

import mentoringMock from "../js/mocks/mentoring.mock.js";

const STORAGE_KEY = "mentoringSessions";

/* get all mentoring sessions */
function getSessions() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {
        return JSON.parse(data);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mentoringMock));

    return mentoringMock;
}

/* get one mentoring session */

function getSessionById(id) {
    const sessions = getSessions();

    return sessions.find((session) => session.id === id);
}

/* save all mentoring sessions */
function saveSessions(sessions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/* create a new mentoring session */
function createSession(session) {
    const sessions = getSessions();

    session.id = Date.now();

    sessions.push(session);

    saveSessions(sessions);
}

/* update a mentoring session */
function updateSession(updatedSession) {
    const sessions = getSessions();

    const newSessions = sessions.map((session) => {
        if (session.id === updatedSession.id) {
            return updatedSession;
        }

        return session;
    });

    saveSessions(newSessions);
}

/* delete a mentoring session */
function deleteSession(id) {
    const sessions = getSessions();

    const newSessions = sessions.filter((session) => session.id !== id);

    saveSessions(newSessions);
}

export {
    getSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession
};