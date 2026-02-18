# Web Applications

Three Next.js applications built on the monorepo's backend services and shared UI package.

---

## 1. Admin Dashboard (Port 3004)

**URL:** http://localhost:3004  
**Purpose:** View user signups and create new user accounts.

### Features
- **Login** (`/login`) – email/password authentication (any user can access; requires `X-Admin-Secret` for listing users)
- **Dashboard** (`/dashboard`) – overview with quick links
- **Users list** (`/dashboard/users`) – paginated table of all users, filter by user type (WORKER/EMPLOYER)
- **Add user** (`/dashboard/add-user`) – create worker or employer accounts via registration API

### Environment
Copy `.env.example` to `.env` and set:
- `NEXT_PUBLIC_AUTH_GRAPHQL_URL` (default: `http://localhost:3001/graphql`)
- `NEXT_PUBLIC_ADMIN_SECRET` – **must match** `ADMIN_SECRET` in auth-service `.env` to enable users list

### Sample login
Any registered user can log in. Use `worker1@example.com` or `employer1@example.com` with password `Password123!` (from seed script).

---

## 2. Worker App (Port 3005)

**URL:** http://localhost:3005  
**Purpose:** Workers search jobs, manage profiles, apply, and track applications.

### Features
- **Login/Register** (`/login`, `/register`) – email/password; registration creates WORKER account
- **Dashboard** (`/dashboard`) – overview and navigation
- **Profile** (`/dashboard/profile`) – create or update worker profile (name, location, skills, bio, experience, availability)
- **Search jobs** (`/dashboard/jobs`) – filter by query, role, employment type, location; paginated results
- **Job detail** (`/dashboard/jobs/[id]`) – view job + employer info; apply with cover message
- **My applications** (`/dashboard/applications`) – list applications and statuses (Pending, Shortlisted, Hired, etc.)

### Environment
Copy `.env.example` to `.env` and set:
- `NEXT_PUBLIC_AUTH_GRAPHQL_URL` (default: `http://localhost:3001/graphql`)
- `NEXT_PUBLIC_USER_GRAPHQL_URL` (default: `http://localhost:3002/graphql`)
- `NEXT_PUBLIC_JOB_GRAPHQL_URL` (default: `http://localhost:3003/graphql`)

### Sample login
- `worker2@example.com` / `Password123!`
- `worker3@example.com` / `Password123!`

---

## 3. Employer App (Port 3006)

**URL:** http://localhost:3006  
**Purpose:** Employers create profiles, post jobs, and manage applicants.

### Features
- **Login/Register** (`/login`, `/register`) – email/password; registration creates EMPLOYER account
- **Dashboard** (`/dashboard`) – overview and navigation
- **Profile** (`/dashboard/profile`) – create or update employer profile (company name, industry, location, contact, desired roles)
- **My jobs** (`/dashboard/jobs`) – list all jobs (draft, published, etc.); quick access to create or manage
- **Create job** (`/dashboard/jobs/new`) – post a job (saved as draft)
- **Job detail** (`/dashboard/jobs/[id]`) – view job, publish (if draft), view applicants, update application status
- **Applicants** – each application shows worker name, skills, experience, location; dropdown to update status (Pending → Shortlisted/Rejected/Hired)

### Environment
Copy `.env.example` to `.env` and set:
- `NEXT_PUBLIC_AUTH_GRAPHQL_URL` (default: `http://localhost:3001/graphql`)
- `NEXT_PUBLIC_USER_GRAPHQL_URL` (default: `http://localhost:3002/graphql`)
- `NEXT_PUBLIC_JOB_GRAPHQL_URL` (default: `http://localhost:3003/graphql`)

### Sample login
- `employer1@example.com` / `Password123!` (CleanCo)
- `employer2@example.com` / `Password123!` (SecureGuard Inc)
- `employer3@example.com` / `Password123!` (KitchenPro)

---

## Shared Components (`packages/ui`)

All three apps use the `@onsite360/ui` package for:
- **UI components:** Button, Input, Card, Select, Label, ErrorMessage, LoadingSpinner
- **Layout:** Header, PageLayout
- **Auth:** AuthProvider (React Context), useAuth hook (login, register, logout, refreshTokens, token storage)
- **GraphQL:** Lightweight fetch wrappers (`graphqlRequest`, `createAuthClient`, etc.)

Components are styled with Tailwind CSS (each app has its own Tailwind config that scans `packages/ui/src`).

---

## Backend Integration

Each app calls the backend GraphQL APIs directly:
- **Auth Service** (3001): register, login, refresh, logout, users list (admin)
- **User Management** (3002): worker/employer profiles (create, read, update)
- **Job Service** (3003): jobs (search, create, update, publish), applications (apply, list, update status)

Protected endpoints (profile, jobs, applications) require header: `Authorization: Bearer <accessToken>` (from login/register response).

---

## Running

1. **Start backends** (if not already running):
   ```bash
   docker compose up -d  # PostgreSQL + Redis
   pnpm dev:all          # Auth, User, Job services
   ```

2. **Seed sample data**:
   ```bash
   pnpm seed
   ```

3. **Start web apps**:
   ```bash
   pnpm dev:web  # All three apps
   # Or individually:
   pnpm dev:admin     # http://localhost:3004
   pnpm dev:worker    # http://localhost:3005
   pnpm dev:employer  # http://localhost:3006
   ```

---

## Testing

### Unit Tests
- **packages/ui:** `pnpm --filter @onsite360/ui test` (LoadingSpinner component)
- **packages/common:** `pnpm --filter @onsite360/common test` (crypto, pagination)
- **auth-service:** `pnpm --filter auth-service test` (AuthService)

### Integration Tests
Currently manual (use GraphQL Playground or web apps). Future: add Playwright/Cypress for full flows.

### Test user accounts
After running `pnpm seed`:
- **Workers:** `worker2@example.com`, `worker3@example.com`
- **Employers:** `employer1@example.com`, `employer2@example.com`, `employer3@example.com`
- **Password:** `Password123!` (all accounts)

---

## Build for Production

```bash
pnpm build:packages           # Build shared packages (types, common, schemas, ui)
pnpm --filter admin-dashboard build
pnpm --filter worker-app build
pnpm --filter employer-app build
```

Each Next.js app creates an optimized production build in `.next/`. Deploy with `pnpm start` (or export static if SSG) and set environment variables for the GraphQL endpoints.

---

## Architecture Notes

- **SSR:** Next.js App Router with React Server Components where possible (e.g., initial dashboard page); client components (`'use client'`) for forms, auth, and interactive UI.
- **State:** Auth state (user, tokens) in React Context (`AuthProvider`) with localStorage persistence; GraphQL calls are direct fetch (no Apollo Client global cache).
- **Routing:** File-based (`app/` directory); nested routes use layouts (e.g., dashboard layout protects all `/dashboard/*` routes).
- **Styling:** Tailwind CSS with shared utility classes; no custom design system (clean, minimal UI).
- **Monorepo:** All three apps share `@onsite360/ui` and `@onsite360/types`; pnpm workspace links ensure changes to shared packages are immediately available.

---

## 4. Standalone Portal (Port 3007)

**URL:** http://localhost:3007  
**Purpose:** Standalone web app (no dependencies in libraries or anywhere else in the monorepo) for unified worker/employer experience. Captures user type at registration to provide different pages/layouts. Directly calls existing GraphQL APIs via inlined fetch helpers.

### Features
- **Register** (`/register`) – email/password + userType (WORKER/EMPLOYER), optional name; determines role-specific UI
- **Login** (`/login`) – email/password
- **Profile** (`/dashboard/profile`) – update with profile photo (URL), name, age/DOB, skills, company name, location, bio, etc. (conditional fields; handles create/update)
- **Conditional Dashboard/Layout** (`/dashboard` + subpages):
  - **Worker flows:** Job listing/search/viewing (`/dashboard/jobs`), applications list (`/dashboard/applications`), worker details via profiles
  - **Employer flows:** Create/view self job postings (`/dashboard/jobs`, `/dashboard/jobs/new`, `/dashboard/jobs/[id]`), list applicants + view worker details
- **Standalone Design:** Minimal deps (Next.js/React only), inlined auth context, GraphQL client, basic Tailwind components; no @onsite360/* packages, types, or UI shared libs
- **Other:** Role-based nav, protected routes, direct API integration for auth/user/job services
- **New Features:** Employer job publish (DRAFT→PUBLISHED), worker apply (w/ cover msg), view applications (applicantsForJob/myApps + worker details/photo/skills), withdraw (new API); fixes prior profile/publish errors
- **Logging:** Integrated for debugging (see below)

### Environment
Copy `.env.example` to `.env` (same GraphQL URLs as other apps).

### Sample Usage
1. Register as WORKER or EMPLOYER
2. Complete profile (now robust w/ create/update)
3. Worker: search/apply jobs, manage apps/withdraw
4. Employer: create/publish jobs, view apps/worker details

**Note:** Full flows active; previously stubbed features implemented. Worker listing via apps + profiles.

### Logging (New)
- **Config:** `NEXT_PUBLIC_LOG_LEVEL=DEBUG|INFO|WARN|ERROR` (portal .env; default INFO). DEBUG verbose for API/profile/job errors.
- **Core Services:** `LOG_LEVEL` env (NestJS Logger all levels; DEBUG=verbose/debug).
- **Details:** graphqlRequest, services/resolvers, profile/job actions instrumented w/ levels. Set DEBUG to trace failures (e.g., mutations, validation).
- Updated in main.ts*, lib/logger.ts, WEB_APPS.md/GRAPHQL_API.md .

---

## Architecture Notes (Standalone Portal)

- **No Library Dependencies:** Self-contained implementation to demonstrate direct API usage and independence.
- **Role-Based UI:** Registration captures userType; dashboard layout/pages adapt dynamically.
- **Error Resilience:** Profile helpers fallback create <-> update; GraphQL direct fetch with token auth.

---

## Future Enhancements

- **Geolocation search:** Add lat/lng to jobs and filter by radius (requires backend: PostGIS or distance calculation).
- **Sort by "last posted":** Implemented in backend (`sortBy: PUBLISHED_AT`); add UI controls in worker jobs search.
- **Browse workers (employer):** Add `workersSearch` API to user-management-service (employer can see all workers, not just applicants).
- **File uploads:** Resume/avatar upload (e.g., S3 or local file storage) for true photo support.
- **Real-time updates:** WebSocket or Server-Sent Events for application status changes.
- **E2E tests:** Playwright or Cypress for full user flows.
- **Enhance Standalone Portal:** Full applicants UI, job apply form, publish job, etc.; mobile responsiveness per DesignLanguage.MD.
