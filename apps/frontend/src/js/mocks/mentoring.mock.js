/* mock mentoring sessions */

const mentoringMock = [
    {
        id: 1,

        /* us-03 */
        topic: "JavaScript Basics",
        description: "Introduction to arrays and objects.",
        tutor_id: 1,

        /* us-04 */
        modality: "virtual",
        session_date: "2026-07-20",
        start_time: "09:00",
        end_time: "11:00",
        room: "",
        meeting_link: "https://meet.google.com/js-basics",

        /* session status */
        status: "scheduled"
    },
    {
        id: 2,

        /* us-03 */
        topic: "PostgreSQL Joins",
        description: "Practice with inner join and left join.",
        tutor_id: 2,

        /* us-04 */
        modality: "in-person",
        session_date: "2026-07-22",
        start_time: "14:00",
        end_time: "16:00",
        room: "Room 204",
        meeting_link: "",

        /* session status */
        status: "scheduled"
    }
];

export default mentoringMock;