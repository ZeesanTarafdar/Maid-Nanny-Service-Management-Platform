# Maid & Nanny Service Management Platform

A full-stack starter build of the platform described in the PRD: households can browse
verified maids, babysitters and nannies, book hourly/monthly/yearly service plans, and track
bookings — while helpers manage their profile and jobs, and admins verify helpers and monitor
bookings.

**Stack**
- Frontend: React.js + Vite, Tailwind CSS
- Backend: Node.js + Express.js (REST API)
- Database: PostgreSQL
- Deployment target: AWS / Vercel / Netlify (frontend), any Node host (backend)

```
maid_and_nanny_service_management_platform/
├── backend/     Express REST API + PostgreSQL schema
└── frontend/    React + Vite + Tailwind single-page app
```

## 1. Prerequisites
- Node.js 18+
- A PostgreSQL 14+ database 

## 2. Backend setup

```bash
cd backend
# edit .env: set DATABASE_URL to your PostgreSQL connection string, and JWT_SECRET to a random string

npm install
npm run migrate   # creates all tables (db/schema.sql)
npm run seed       # inserts default service plans + a demo admin user
npm run dev         # starts the API on http://localhost:5000/api
```

Demo admin login (created by `npm run seed`):
- Email: `admin@gmail.com`
- Password: `Admin@123`
> Change this password/hash before using in anything beyond local development.

## 3. Frontend setup

```bash
cd frontend
# VITE_API_BASE_URL defaults to http://localhost:5000/api — adjust if your API runs elsewhere

npm install
npm run dev   # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so the frontend and
backend can be run side by side without CORS issues in development.

## 4. What's implemented

**Household**
- Register / log in
- Browse & filter helpers by service type, city, and plan cycle (hourly/monthly/yearly)
- View a helper's profile, plans and reviews
- Book a service plan, track booking status, cancel a pending/accepted booking
- Leave a rating & review after a completed booking

**Helper (maid / babysitter / nanny)**
- Register with a chosen service type
- Edit profile (experience, bio, skills, rates), opt into service plans
- Submit identity/background documents for verification (simulated upload — swap in real
  file storage such as S3 for production)
- Accept / reject booking requests, move a job to in-progress, mark it completed
- View earnings (read-only, per PRD Phase 1 scope)

**Admin**
- Dashboard with platform KPIs (registered households, verified helpers, active bookings, etc.)
- Approve or reject pending helper verifications
- Monitor and cancel bookings platform-wide

## 5. Data model
See `backend/db/schema.sql` for the full schema — core entities are `users`, `helpers`,
`service_plans`, `services`, `bookings`, and `reviews`, matching the PRD's data requirements.

## 6. Deployment

This project is deployed using the following free-tier services:

- **Database**: [Neon](https://neon.tech) (managed PostgreSQL)
- **Backend**: [Render](https://render.com) (Node.js web service)
- **Frontend**: [Vercel](https://vercel.com) (static Vite build)

### Live URLs
- Frontend: https://maid-nanny-service-management-platf.vercel.app/login
- Backend API: https://maid-nanny-service-management-platform.onrender.com/api

### Deployment steps

**1. Database (Neon)**
- Create a project at neon.tech and copy the connection string
- Run migrations and seed data against it:
```bash
  cd backend
  DATABASE_URL="<your-neon-connection-string>" npm run migrate
  DATABASE_URL="<your-neon-connection-string>" npm run seed
```

**2. Backend (Render)**
- New Web Service → connect this repo → Root Directory: `backend`
- Build Command: `npm install` · Start Command: `npm start`
- Environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`

**3. Frontend (Vercel)**
- New Project → connect this repo → Root Directory: `frontend`
- Build Command: `npm run build` · Output Directory: `dist`
- Environment variable: `VITE_API_BASE_URL` = `<your-render-backend-url>/api`

Both Render and Vercel auto-redeploy on every push to `main`.

