# TutorCode — Mentorship and Feedback Management System

A web platform for Riwi to manage mentorship sessions, mentorship requests, observations, and feedback between Team Leaders, Tutors, and Coders, scoped by clan (cohort/team) and role.

---

# Project Status

🟢 Functional core — sessions, requests, observations, feedback, and role-scoped dashboards are implemented and connected end to end between frontend, backend, and database.

Implemented:

- JWT-based authentication (own login, not a third-party provider).
- Three roles: **Team Leader**, **Tutor**, **Coder** — clan-scoped throughout the app.
- Mentorship sessions: create/edit, status transitions, participant assignment (open vs. closed sessions).
- Mentorship requests initiated by Coders, actioned by Team Leader/Tutor.
- Coder observations and Tutor observations (separate models, full CRUD).
- Session feedback (dual rating: tutor + session) submitted by Coders.
- Role-scoped dashboard (`/dashboard`) and Team-Leader-only metrics (`/metrics`).
- Docker Compose environment with hot reload for both apps.

Not implemented yet (see [Roadmap](#roadmap)):

- Topics/Clans catalog management UI (topics and clans are seeded directly in the database; there's no UI/endpoint to manage them).
- Dedicated "My agenda" and "History with filters" views (the general mentorship list covers this today, without saved filters).
- Dashboard "Recent mentorships / Recent activity" widgets are static placeholders — the stat cards above them are wired to real data.

---

# Overall Architecture

```
Frontend (Vite, Vanilla JS SPA)
        │  fetch + JWT (Bearer token)
        ▼
Express Backend (REST API)
        │  routes → controllers → services → repositories/models
        ▼
PostgreSQL
```

The frontend never talks to the database directly — every request goes through the Express REST API. Three Docker services (`frontend`, `backend`, `db`) are orchestrated with `docker-compose.yml`.

---

# Authentication Flow

1. The user logs in with email + password from the frontend (`POST /api/auth/login`).
2. The backend verifies the password hash (bcrypt) and issues a signed JWT (`jsonwebtoken`).
3. The frontend stores the token in `sessionStorage` (`tutorcode_token`) and attaches it as `Authorization: Bearer <token>` on every request.
4. `authMiddleware` verifies the token on protected routes; `attachDbUser` middleware then loads the user's `{id, role, clanId}` from the database and attaches it to `req.user` for the rest of the request pipeline.
5. The frontend router (`router.js`) redirects unauthenticated users to `/login` and blocks access to app routes without a valid session.

There is no third-party identity provider — authentication is fully self-hosted (JWT + bcrypt).

---

# Technologies

## Frontend

- **HTML5 / CSS3** — structure and styling, no CSS framework.
- **JavaScript (ES6+), no framework** — the entire frontend is vanilla JS. HTML is built via template strings and wired up with inline `onclick="..."` handlers, so page-level functions are exposed on `window` (`js/globals.js`) to be reachable from markup.
- **Vite** — dev server and build tool (fast HMR, native ES modules, zero-config).

### Structure

```
apps/frontend/src/js/
    router.js         custom SPA router (path → render + init function)
    globals.js         registers page/module functions on window
    components/         shared UI pieces (header, sidebar, etc.)
    pages/               per-screen render + event logic
    services/            fetch layer: API calls, in-memory cache, data normalization
```

## Backend

- **Node.js + Express 5** — REST API.
- **PostgreSQL via `pg`, no ORM** — plain parameterized SQL (`pool.query(sql, [params])`).
- **jsonwebtoken + bcryptjs** — authentication.
- **helmet + cors** — security headers and CORS policy.
- **morgan** — request logging.
- **nodemon** — dev-mode autoreload.

### Structure (layered architecture)

```
apps/backend/src/
    routes/          endpoint + HTTP verb definitions, no business logic
    controllers/       HTTP concerns: input validation, status codes, req/res
    services/           business rules (e.g. session status transitions, clan checks)
    repositories/  |     data access: parameterized SQL against PostgreSQL
    models/
    middleware/          auth, DB user attachment, role gating, error handling
    utils/                asyncHandler, ApiError, ApiResponse
    config/                 roles, database pool
```

`asyncHandler` wraps async controllers so thrown errors reach the central error middleware without repeating `try/catch`. `ApiError(message, statusCode)` and `ApiResponse` keep error/response shapes consistent (`{ success, message, data }`).

## Database

- **PostgreSQL 16**, no migration tool — the schema lives in init scripts that Postgres runs **once** against an empty volume:
  - `apps/database/init/001_schema.sql` — tables, enums, constraints, indexes.
  - `apps/database/init/002_seed.sql` — roles, clans, and a realistic multi-clan/multi-role dataset for local development.
  - `apps/database/init/003_functions.sql` — reserved, currently unused.
- Any schema change requires resetting the local volume (`docker compose down -v && docker compose up -d --build`) to re-run the init scripts.

### Key tables

| Table | Purpose |
|---|---|
| `roles`, `clans` | Postgres ENUMs backing tables (`user_role`, `clan_name`) |
| `users` | `role_id`, `clan_id`, bcrypt `password_hash` |
| `mentoring_sessions` | `mentorship_type` (group/individual), `modality` (virtual/in person), `session_type` (open/closed), `status` (scheduled/in_progress/completed/cancelled), `clan_id`, `tutor_id` |
| `session_coders` | N:M bridge between sessions and coder participants |
| `mentoring_requests` | Coder-initiated requests (`pending`/`accepted`/`denied`) |
| `session_feedback` | Coder-submitted dual rating (`tutor_rating`, `session_rating`) per session |
| `coder_observations` / `tutor_observations` | Separate observation models for coders and tutors, each with `observed_by`, optional `session_id`, and recommendations |

## Infrastructure

- **Docker** — one image per app (`apps/backend`, `apps/frontend`).
- **Docker Compose** — local orchestration of `frontend` (5173), `backend` (3000), `db` (Postgres, port from `.env`).

---

# Core Concept: Role + Clan Scoping

Almost every resource in the system is scoped along **two axes**:

1. **Role** — `Team Leader`, `Tutor`, `Coder`, each with different read/write permissions.
2. **Clan** — the cohort/team a user belongs to (`users.clan_id`), acting as a tenant boundary. Most list/read queries filter by `clan_id = req.user.clanId`, so a Team Leader or Tutor only sees data from their own clan.

The one deliberate exception is **`session_type = 'open'`**: an open session can have participants from any clan, while a `closed` session is clan-exclusive. This is the one place in the system where cross-clan access is intentional — everywhere else it's a boundary that must be enforced explicitly in each query/controller, since there's no ORM-level tenant scoping to fall back on.

---

# Implemented Features

## Authentication
- `POST /auth/login`, `GET /auth/me`.
- JWT verification middleware + role-gating middleware (`requireRole`).

## Mentorship Sessions (`/sessions`)
- List (role/clan-scoped), get by id, create, update, cancel.
- `PATCH /sessions/:id/status` — status transitions enforced server-side.
- `POST /sessions/:id/participants` — assign coders, respecting `session_type` (open = any clan, closed = same clan only).

## Mentorship Requests (`/mentoring-requests`)
- Coders create requests; Team Leader/Tutor list (clan-scoped), view, accept/deny, delete.

## Observations
- `/coder-observations` and `/tutor-observations` — independent CRUD resources, each clan-validated on create/read/update/delete.
- `/observations` — combined read endpoint used by the Observations page.

## Session Feedback (`/sessions/:sessionId/feedback`)
- Coders submit a dual rating (tutor + session) once a session is completed.
- Team Leaders can view feedback for sessions in their own clan.

## Dashboard & Metrics (`/dashboard`)
- `GET /dashboard/summary` — role-scoped stat cards (different shape for Coder / Tutor / Team Leader).
- `GET /dashboard/metrics` — Team-Leader-only breakdown by status/modality, average rating, active coders.

## System Roles
- Team Leader
- Tutor
- Coder

(There is no Administrator role — it was intentionally removed; the Team Leader is the top-level role in this system.)

---

# Security

- Passwords hashed with **bcrypt** (`bcryptjs`), never stored in plain text.
- **JWT** signed tokens (`JWT_SECRET`, `JWT_EXPIRES_IN`), verified on every protected route.
- **helmet** for security headers, **CORS** restricted to `CORS_ORIGIN`.
- All SQL is parameterized (`$1, $2...` placeholders via `pg`) — no string-concatenated queries.
- Role + clan checks are enforced in controllers/services on every mutating endpoint (create/update/delete), not just in the UI.

---

# Installation

## With Docker (recommended)

```bash
cp .env.example .env   # fill in DB_*, JWT_SECRET, etc.
docker compose up -d --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- The database is seeded automatically on first run (empty volume). To force a reseed after changing `001_schema.sql` / `002_seed.sql`:

```bash
docker compose down -v && docker compose up -d --build
```

## Without Docker

### Backend

```bash
cd apps/backend
npm install
npm run dev
```

### Frontend

```bash
cd apps/frontend
npm install
npm run dev
```

A local PostgreSQL instance is required, with `001_schema.sql` and `002_seed.sql` applied manually.

---

# Environment Variables

A single `.env` at the project root, consumed by `docker-compose.yml` and the backend. See `.env.example`:

```
PORT, NODE_ENV
DB_PORT, DB_PORT_MAP, DB_NAME, DB_USER, DB_PASSWORD
JWT_SECRET, JWT_EXPIRES_IN
CORS_ORIGIN
```

---

# Test Credentials (seed data)

All seeded users share the password `Password123!`. The seed covers two clans so role/clan-scoping can be tested from multiple angles:

| Email | Role | Clan |
|---|---|---|
| maria.torres@tutorlink.com | Team Leader | Magdalena |
| ana.garcia@tutorlink.com / diego.fernandez@tutorlink.com | Tutor | Magdalena |
| kevin.mendoza / juan.perez / valentina.rojas / andres.silva@tutorlink.com | Coder | Magdalena |
| sofia.ramirez@tutorlink.com | Team Leader | Garabato |
| carlos.lopez / camila.torres@tutorlink.com | Tutor | Garabato |
| laura.castro / mateo.gomez / isabella.cruz@tutorlink.com | Coder | Garabato |

---

# Roadmap

- [x] JWT authentication (own implementation, replacing the earlier Firebase-based plan)
- [x] Role + clan-scoped access control across sessions, requests, observations, and feedback
- [x] Mentorship session CRUD and status transitions
- [x] Participant assignment (open/closed clan rules)
- [x] Mentorship requests (Coder-initiated)
- [x] Coder and Tutor observations
- [x] Session feedback (dual rating)
- [x] Role-scoped dashboard + Team Leader metrics
- [ ] Topics/Clans catalog management (currently free-text/seed-only)
- [ ] Dedicated "My agenda" view for Tutor/Team Leader
- [ ] "History" view with saved date/tutor filters
- [ ] Dashboard "Recent mentorships" / "Recent activity" widgets (currently static)

---

# Software Architecture Summary

- REST API, frontend/backend fully decoupled.
- Backend: Routes → Controllers → Services → Repositories/Models, no ORM.
- Frontend: vanilla JS SPA, custom router, services layer for data fetching.
- Multi-tenant-style access control via role + clan, enforced at the controller/service layer on every request.
- Schema-as-code via ordered SQL init scripts (no migration tool), volume reset required for schema changes in development.
