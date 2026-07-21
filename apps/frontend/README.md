# TutorCode — Frontend

> **Integrative Project | RIWI Academy | Basic Track 2026**
> Mentoring management platform connecting Coders, Tutors and Team Leaders.

---

## Frontend Developer

| Field | Detail |
|-------|---------|
| Name | Kevin Mendoza |
| Role | Frontend Developer |
| Branch | `Kevin-Mendoza` |
| Repository | [PROYECTO-MENTORIA-Y-RETROALIMENTACION](https://github.com/Zolagos/PROYECTO-MENTORIA-Y-RETROALIMENTACION) |

---

## Tech Stack

| Technology | Version | Use |
|------------|---------|-----|
| HTML5 | — | Semantic, accessible structure |
| CSS3 | — | Variables, Flexbox, Grid, animations |
| Vanilla JavaScript | ES2020+ | SPA logic, validation, DOM |
| Git / GitHub | — | Version control with GitFlow |

> **No frameworks.** No React, Angular, Vue or jQuery. Project requirement.

---

## How to run

```bash
# 1. Clone the repository
git clone https://github.com/Zolagos/PROYECTO-MENTORIA-Y-RETROALIMENTACION.git

# 2. Enter the frontend folder
cd PROYECTO-MENTORIA-Y-RETROALIMENTACION

# 3. Open with Live Server (VS Code) or double-click index.html
```

> Requires no npm, node, or dependency installation. Pure HTML/CSS/JS.

---

## Project Structure

```
├── index.html                  → Entry point (redirects to login)
│
├── pages/
│   ├── login.html              → Authentication screen
│   └── app.html                → SPA shell (contains sidebar + header)
│
├── css/
│   ├── main.css                → CSS variables, reset, typography
│   ├── layout.css              → Header, sidebar, general structure
│   ├── components.css          → Buttons, cards, badges, tables, modals
│   ├── animations.css          → Transitions and animations
│   ├── responsive.css          → Media queries (mobile first)
│   └── pages/
│       ├── login.css           → Login screen styles
│       ├── dashboard.css       → Dashboard and metrics styles
│       ├── mentoring.css       → Mentoring page styles
│       └── observations.css    → Observations and feedback styles
│
├── js/
│   ├── utils.js                → Modals, toasts, debounce, dates
│   ├── router.js                → Hash-based SPA router
│   ├── app.js                  → View initialization and renders
│   ├── components/
│   │   ├── sidebar.js          → Sidebar dynamic by user role
│   │   └── header.js           → Header with user menu
│   ├── pages/
│   │   ├── login.js            → Login validation and logic
│   │   ├── dashboard.js        → Dashboard interactions
│   │   ├── mentoring.js        → Mentoring filters, modals, actions
│   │   ├── observations.js     → Observations logic
│   │   └── feedback.js         → Star rating and feedback
│   └── services/
│       ├── api.js              → REST service layer (ready for Sprint 4)
│       └── auth.js             → Firebase authentication flow (prepared)
│
└── assets/
    ├── icons/
    └── images/
```

---

## SPA Architecture

The frontend uses **SPA (Single Page Application)** navigation based on hash:

```
URL: pages/app.html#/dashboard
              ↓
         router.js
              ↓
    Reads the hash: '/dashboard'
              ↓
    Calls renderDashboard()
              ↓
    Injects HTML into #page-content
              ↓
    Calls initDashboard() (event listeners)
```

**Why hash-based?**
It requires no server. Works with `file://` and with GitHub Pages with no extra configuration.

---

## Roles and Dashboards

| Role | Dashboard | Access to |
|-----|-----------|----------|
| CODER | Coder Dashboard | My mentorships, Feedback |
| TUTOR | Tutor Dashboard | Mentorships, My Coders, Observations |
| TL | TL Dashboard | Everything + Metrics + Users |
| ADMIN | Admin Dashboard | Full access + Settings |

The sidebar is built **dynamically** based on role. This means a Coder never sees TL options, and vice versa.

---

## Authentication Flow (Sprint 4)

```
User enters email + password
         ↓
   Firebase Authentication
   (validates credentials)
         ↓
   Returns ID Token
         ↓
   Express Backend
   (Firebase Admin SDK verifies token)
         ↓
   PostgreSQL: looks up user by firebase_uid
         ↓
   Active user? → YES → Returns profile (id, name, role, clan)
                → NO → Access denied
         ↓
   Frontend saves profile to sessionStorage
         ↓
   Redirects to dashboard based on role
```

**Files involved:**
- `js/pages/login.js` → captures and validates the form
- `js/services/auth.js` → calls Firebase + backend
- `js/services/api.js` → `fetchAPI('/auth/verify', ...)`

---

## Design System

### Color palette

```css
--color-primary:       #1877F2   /* Primary blue */
--color-primary-dark:  #0f5fcf   /* Hover blue */
--color-accent-green:  #00C48C   /* Success / active */
--color-accent-orange: #FF6B35   /* Pending / alert */
--color-accent-red:    #E53935   /* Error / cancelled */
--color-sidebar-bg:    #18191A   /* Dark sidebar */
--color-bg:            #F0F2F5   /* General background */
```

### Typography
- Font: `Segoe UI` / `system-ui` (no external loading)
- Scale: xs(12) → sm(14) → base(16) → lg(18) → xl(20) → 2xl(24) → 3xl(30)

### Spacing
4px system: `--space-1` (4px) up to `--space-12` (48px)

---

## Technical Decisions

### Why CSS Variables instead of SASS?
CSS Variables are native to the browser. They need no compilation, are simpler to maintain, and anyone on the team can understand them without knowing SASS.

### Why SPA with hash instead of separate pages?
The project's technical requirement demands SPA navigation. The hash lets the view change without reloading the page, and it works with no backend server.

### Why inline SVG instead of an icon library?
We don't depend on a CDN or external libraries (Font Awesome, etc.). The project works offline and the bundle is lighter.

### Why centralize the fetches in `api.js`?
If the backend team changes a route (e.g: `/api/mentoring` → `/api/v2/mentoring`), it's changed in one place only. No need to search through 10 files.

### Why sessionStorage and not localStorage?
sessionStorage clears automatically when the tab closes. Safer for authentication tokens on shared computers.

---

## GitFlow Evidence

| Commit | Message | Sprint |
|--------|---------|--------|
| `3bb5528` | feat: Initialize frontend structure | Sprint 1 |
| `1d0305f` | feat: Build visual pages and interactions | Sprint 2 & 3 |
| *(next)* | feat: Polish UI, animations and docs | Sprint 5 |

**Strategy:**
- Working branch: `Kevin-Mendoza`
- Never worked directly on `main`
- Pull Request to `main` when finished

---

## Manual Testing

### Login
- [x] Empty email → shows error
- [x] Invalid email format → shows error
- [x] Password < 6 chars → shows error
- [x] Show/hide password toggle
- [x] Spinner during submit
- [x] Redirects to `app.html` with valid credentials

### Sidebar
- [x] TL role sees: Dashboard, Mentorships, Users, Observations, Feedback, Metrics
- [x] CODER role sees: Dashboard, My Mentorships, Feedback
- [x] TUTOR role sees: Dashboard, Mentorships, My Coders, Observations
- [x] Collapse/expand on desktop
- [x] Drawer on mobile with overlay

### Mentorships
- [x] Cards render with sample data
- [x] Search filters in real time
- [x] Toggle between grid and list view
- [x] Actions menu (3 dots) per card
- [x] "New Mentorship" modal opens and validates fields

### Observations
- [x] Timeline renders
- [x] Coder list in sidebar
- [x] "New Observation" modal validates required fields

### Feedback
- [x] Interactive star rating
- [x] "Give Feedback" modal validates rating and comment
- [x] Confirmation toast on submit

### Responsive
- [x] Login: form only on mobile
- [x] Sidebar: drawer on mobile, collapsible on desktop
- [x] Stats grid: 4 cols → 2 cols → 1 col
- [x] Modals: bottom sheet on mobile

---

## Pending (connect with backend)

When the backend team has the endpoints ready:

1. **Authentication:** uncomment the code in `js/services/auth.js` and `js/pages/login.js`
2. **Mentorships:** replace the sample data in `getMentoringCards()` with `await mentoringService.getAll()`
3. **Observations:** replace `getObservationsTimeline()` with `await observationsService.getAll()`
4. **Feedback:** replace the sample data with `await feedbackService.getAll()`
5. **Dashboard stats:** connect the counters with `await usersService.getAll()` and filters

All services are in `js/services/api.js` with their endpoints documented.

---

*TutorCode — RIWI Integrative Project 2026*
*"Because the next level isn't reached alone, it's built as a team."*
