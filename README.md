# Vizlogic COE Microsite — Sales Automation (V-CSAP)

A full-stack microsite for Vizlogic's Centre of Excellence on Sales Automation
(DMS / SFA). Implements the BRD end-to-end: Home, About COE, Program,
Curriculum, Career Path, Admission, Fees, Apply Now — plus an admin panel for
verifying QR-based payments and managing application statuses.

## Tech stack

- **Frontend**: React 18 + Vite + React Router + Tailwind CSS (TypeScript)
- **Backend**: Node.js + Express (TypeScript)
- **Storage**: JSON file (pure-JS, zero native deps, runs on any Node / OS)
- **Auth**: Signed-cookie admin session (HMAC-SHA256)

```
microsite/
├── client/        # React (Vite) frontend
│   ├── src/
│   │   ├── pages/      Home, About, Program, Curriculum, CareerPath,
│   │   │                Admission, Fees, Apply, Admin, NotFound
│   │   └── components/ Nav, Footer, PageHeader, ApplyForm,
│   │                    PaymentStep, AdminLogin, AdminDashboard
│   └── vite.config.ts  (dev proxies /api → http://localhost:3001)
├── server/        # Express API
│   ├── src/
│   │   ├── index.ts     Express app + static client serving
│   │   ├── db.ts        SQLite setup
│   │   ├── auth.ts      Admin cookie auth + requireAdmin middleware
│   │   └── routes/      enroll.ts, payment.ts, admin.ts
└── package.json   # Root scripts (runs both apps together)
```

## Getting started

### 1. Install dependencies (first time)

```bash
npm run install:all
```

This installs deps in the root, `server/`, and `client/`.

### 2. (Optional) Configure environment

```bash
cp .env.example .env
# Edit .env to set ADMIN_PASSWORD and ADMIN_COOKIE_SECRET
```

Defaults are fine for local development. When running `npm run dev:server`
the env is loaded by your shell — set vars in your shell profile, or use a
process manager that loads `.env` in production.

### 3. Run in development

```bash
npm run dev
```

That starts both apps together:

- **API server** at http://localhost:3001
- **React dev server** at http://localhost:5173 (with hot reload)

Open http://localhost:5173 — API calls are automatically proxied to the server.

You can also run them separately:

```bash
npm run dev:server   # just the API
npm run dev:client   # just the React dev server
```

### 4. Production build

```bash
npm run build        # builds server (to server/dist) and client (to client/dist)
npm start            # runs the server, which serves the built client
```

Open http://localhost:3001 — the Express server now serves the React app and
the API from a single port.

## Pages

| Route           | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `/`             | Home — hero, industry focus, COE pitch, CTAs       |
| `/about`        | About the COE, vision, challenges, solution map    |
| `/program`      | V-CSAP program details and lab setup               |
| `/curriculum`   | Six-module curriculum                              |
| `/career-path`  | Roles and growth trajectory                        |
| `/admission`    | Eight-step admission process                       |
| `/fees`         | Fee plans, scholarships, payment FAQ               |
| `/apply`        | Application form + QR payment step                 |
| `/admin`        | Admin panel (password protected)                   |

## API

All endpoints are under `/api/*`.

| Method | Path                                | Auth   | Purpose                           |
| ------ | ----------------------------------- | ------ | --------------------------------- |
| GET    | `/api/health`                       | —      | Health check                      |
| POST   | `/api/enroll`                       | —      | Submit an application             |
| POST   | `/api/payment`                      | —      | Record a UPI reference / UTR      |
| POST   | `/api/admin/login`                  | —      | Admin password sign-in            |
| POST   | `/api/admin/logout`                 | admin  | Sign out                          |
| GET    | `/api/admin/enrollments`            | admin  | List all enrollments              |
| PATCH  | `/api/admin/enrollments/:id`        | admin  | Update payment / application status |
| DELETE | `/api/admin/enrollments/:id`        | admin  | Remove an enrollment              |

## Admin panel

`/admin` — default password (dev): `vizlogic-admin-2026`. Override with the
`ADMIN_PASSWORD` env var. Also set `ADMIN_COOKIE_SECRET` to a random string
in production.

## Data

Enrollments are stored in `./server/data/vizlogic.json` by default (override
with `DATABASE_PATH`). The `data/` folder is gitignored. No native
dependencies — works on any Node.js version / OS without Python or a C++
toolchain.

## Enrollment flow

1. Candidate submits `/apply` form (name, phone, email, country, course, plan).
2. They are shown a UPI QR placeholder and UPI ID to pay.
3. After paying, they enter the UPI reference / UTR.
4. Admin signs in at `/admin`, manually verifies the payment reference, and
   moves the application through the status pipeline.
