# Mentorship and Feedback Management System

A web platform developed for Riwi to manage mentorships, academic support sessions, feedback, and student follow-up through a secure role-based authentication system.

---

# Objective

Centralize the creation, assignment, and tracking of mentorship sessions within Riwi by providing a platform where Administrators, Team Leaders, Tutors, and Coders can interact securely and efficiently.

---

# Project Status

🚧 Under Development

Currently implemented:

- Decoupled Frontend and Backend architecture.
- Google Authentication with Firebase Authentication.
- User identity verification using Firebase Admin SDK.
- User session management.
- Protected Frontend routes.
- Modular architecture designed for scalability.

---

# Overall Architecture

```
Frontend (Vite)

        │

        ▼

Firebase Authentication
(Google Sign-In)

        │

Firebase ID Token

        │

        ▼

Express Backend

        │

Token Verification
(Firebase Admin SDK)

        │

        ▼

REST API

        │

        ▼

PostgreSQL
```

The Frontend never communicates directly with the database. All communication is handled through the Express REST API.

---

# Authentication Flow

1. The user signs in with Google from the Frontend.
2. Firebase authenticates the user.
3. Firebase generates an **ID Token**.
4. The Frontend sends the token to the Backend.
5. The Backend validates the token using Firebase Admin SDK.
6. If the token is valid, the Backend returns the authenticated user information.
7. The Frontend stores the session and grants access to protected routes.

---

# Technologies

## Frontend

### HTML5

Application structure.

### CSS3

Application styling and responsive layout.

### JavaScript (ES6+)

The entire Frontend is built using modern Vanilla JavaScript without additional frameworks.

### Vite

Development server and build tool.

Chosen because it provides:

- Extremely fast Hot Module Replacement (HMR).
- Minimal configuration.
- Native ES Modules support.
- Optimized production builds.

### Firebase Authentication

Handles Google authentication.

It was chosen because it:

- Significantly reduces development time.
- Eliminates the need to manually implement the OAuth flow.
- Provides secure Firebase ID Tokens.
- Integrates seamlessly with Firebase Admin SDK.
- Avoids implementing a custom JWT authentication system, which has not yet been covered during the training process.

---

## Backend

### Node.js

JavaScript runtime environment.

### Express.js

REST API framework.

The Backend follows a modular architecture based on:

- Controllers
- Services
- Routes
- Middleware
- Validators

### Firebase Admin SDK

Responsible for verifying Firebase ID Tokens received from the Frontend.

Its primary responsibility is ensuring that requests are made by users who have been successfully authenticated by Firebase before allowing access to protected resources.

---

## Database

### PostgreSQL

Relational database management system.

It will store all business-related data, including:

- Users
- Mentorships
- Sessions
- Feedback
- Roles
- History
- Catalogs

Authentication remains delegated to Firebase, while PostgreSQL stores the application's business data.

---

## Infrastructure

### Docker

Containerization of application services.

### Docker Compose

Local development environment orchestration.

---

# Backend Architecture

The Backend follows a modular architecture.

```
modules/

    auth/

        controllers/

        services/

        validators/

        middleware/

        routes/

config/

middleware/

utils/
```

Each module is independent, making the project easier to maintain and scale.

---

# Implemented Features

## Authentication

- Google Sign-In.
- Firebase ID Token verification.
- Authentication middleware.
- Login endpoint.
- Authenticated user endpoint.
- Protected routes.
- Session persistence.

---

# Features in Development

- Dashboard.
- User Management.
- Role Management.
- Mentorship Management.
- Calendar.
- User Profile.
- Mentorship History.
- Feedback System.
- Reports.
- Administration Panel.

---

# System Roles

- Administrator
- Team Leader
- Tutor
- Coder

Each role will have specific permissions depending on the available system modules.

---

# Security

Authentication is fully handled by Firebase Authentication.

Security technologies include:

- Firebase Authentication.
- Firebase Admin SDK.
- Firebase ID Tokens.
- Authentication middleware.
- Helmet.
- CORS.

A custom JWT implementation was intentionally avoided because Firebase already provides signed and verified tokens, reducing complexity while improving security.

---

# Installation

## Backend

```bash
cd apps/backend

npm install

npm run dev
```

## Frontend

```bash
cd apps/frontend

npm install

npm run dev
```

---

# Environment Variables

## Backend

See:

```
apps/backend/.env.example
```

## Frontend

See:

```
apps/frontend/.env.example
```

---

# Roadmap

- [x] Initial project setup
- [x] Modular architecture
- [x] Firebase Authentication
- [x] Google Sign-In
- [x] Firebase ID Token validation
- [x] Session management
- [x] Route protection
- [ ] Dashboard
- [ ] User Management
- [ ] Role Management
- [ ] Mentorship Management
- [ ] Feedback System
- [ ] Reports
- [ ] Administration Panel

---

# Software Architecture

- Modular Architecture.
- REST API.
- Frontend / Backend separation.
- Controller → Service → Repository pattern.
- Middleware-based authentication and error handling.