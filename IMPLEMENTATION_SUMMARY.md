# Implementation Summary – Three Next.js Web Apps

Complete implementation of admin dashboard, worker app, and employer app with shared UI components, integrated into the existing pnpm monorepo.

---

## What Was Built

### 1. Shared UI Package (`packages/ui`)
- **Components:** Button, Input, Card, Label, ErrorMessage, LoadingSpinner, Select (all with Tailwind CSS)
- **Layout:** PageLayout, Header (with nav, logo, right content slots)
- **Auth:** AuthProvider (React Context), useAuth hook
  - Methods: `login()`, `register()`, `logout()`, `refreshTokens()`, `setTokens()`, `clearAuth()`
  - State: `user`, `accessToken`, `refreshToken`, `isAuthenticated`, `isLoading`
  - Storage: `localStorage` (persists across page reloads)
- **GraphQL:** Lightweight fetch helpers (`graphqlRequest`, `createAuthClient`, `createUserClient`, `createJobClient`)
- **Tests:** 3 unit tests (LoadingSpinner) with Jest + React Testing Library
- **Build:** TypeScript → ESNext, React 18+, works with Next.js transpilePackages

### 2. Backend Extensions

#### Auth Service (port 3001)
- **New API:** `users(input: ListUsersInput!)` → `PaginatedUsers`
  - Filters: `userType`, `page`, `pageSize`, `since` (ISO date)
  - Guard: `AdminSecretGuard` – requires header `X-Admin-Secret` = env `ADMIN_SECRET`
- **DTOs:** `ListUsersInput`, `PaginatedUsers`
- **Env:** Added `ADMIN_SECRET` to `.env.example`

#### Job Service (port 3003)
- **Extended API:** `JobSearchInput` now supports:
  - `sortBy`: `PUBLISHED_AT` (default), `CREATED_AT`, `TITLE`
  - `sortOrder`: `DESC` (default), `ASC`
- **Enums:** `JobSearchSortBy`, `SortOrder` (registered in GraphQL)
- **Implementation:** Updated `JobService.search()` to use sortBy/sortOrder with TypeORM query builder

#### Schemas Package
- **Fix:** Cached compiled AJV schemas to prevent "schema already exists" error on repeated validations
- **Change:** `validateWithSchema()` now uses Map<schemaId, compiledValidator> to avoid re-compiling

### 3. Admin Dashboard (`apps/admin-dashboard`, port 3004)

**Routes:**
- `/` → redirects to `/login` or `/dashboard`
- `/login` – email/password login (uses `AuthProvider`)
- `/dashboard` – overview with links to users and add user
- `/dashboard/users` – paginated users table, filter by type, requires `X-Admin-Secret`
- `/dashboard/add-user` – form to create worker or employer (calls `registerWithEmail`)

**Features:**
- Shared layout (Header with nav, logout button)
- Uses `@onsite360/ui` components (Button, Input, Card, Select, etc.)
- Calls Auth Service GraphQL for login and users list (with admin secret header)

**Environment:** `.env` with `NEXT_PUBLIC_AUTH_GRAPHQL_URL`, `NEXT_PUBLIC_ADMIN_SECRET`

### 4. Worker App (`apps/worker-app`, port 3005)

**Routes:**
- `/` → redirects to `/login` or `/dashboard`
- `/login`, `/register` – authentication (register creates WORKER)
- `/dashboard` – overview
- `/dashboard/profile` – create or update worker profile (name, location, skills, bio, experience, availability)
- `/dashboard/jobs` – search jobs with filters (query, role, employment type, location); paginated
- `/dashboard/jobs/[id]` – job detail + employer info (company name, industry, location); apply with cover message
- `/dashboard/applications` – my applications list with status and job links

**Features:**
- Profile: loads `workerProfile(userId)`, creates via `createWorkerProfile`, updates via `updateWorkerProfile`
- Jobs: calls `jobsSearch()` from Job Service; for each job, fetches `employerProfile(employerId)` from User Service
- Apply: `applyToJob(input)` with optional cover message
- Applications: `myApplications()` with job relation (shows job title, role, location)

**Environment:** `.env` with `NEXT_PUBLIC_AUTH_GRAPHQL_URL`, `NEXT_PUBLIC_USER_GRAPHQL_URL`, `NEXT_PUBLIC_JOB_GRAPHQL_URL`

### 5. Employer App (`apps/employer-app`, port 3006)

**Routes:**
- `/` → redirects to `/login` or `/dashboard`
- `/login`, `/register` – authentication (register creates EMPLOYER)
- `/dashboard` – overview
- `/dashboard/profile` – create or update employer profile (company name, industry, contact, location, desired roles)
- `/dashboard/jobs` – my jobs list (all statuses: draft, published, closed)
- `/dashboard/jobs/new` – create job (saved as draft)
- `/dashboard/jobs/[id]` – job detail + applicants list; publish job (if draft); update application status

**Features:**
- Profile: loads `employerProfile(userId)`, creates/updates via mutations
- Jobs: `myJobs()` from Job Service, `createJob()`, `updateJob()`, `publishJob()`
- Applicants: `applicationsForJob(jobId)` + `workerProfile(userId)` for each applicant
- Status update: dropdown select (Pending, Shortlisted, Rejected, Hired, Withdrawn) → `updateApplicationStatus()`

**Environment:** `.env` with `NEXT_PUBLIC_AUTH_GRAPHQL_URL`, `NEXT_PUBLIC_USER_GRAPHQL_URL`, `NEXT_PUBLIC_JOB_GRAPHQL_URL`

### 6. Seed Script (`scripts/seed/run.mjs`)

- **Purpose:** Create sample data for testing and UI demo
- **Creates:**
  - 3 workers (worker1-3@example.com)
  - 3 employers (employer1-3@example.com)
  - Worker and employer profiles
  - 6 published jobs (2 per employer, varied roles)
  - 4 applications (workers → jobs)
- **Password:** `Password123!` for all accounts
- **Usage:** `pnpm seed` (or `node scripts/seed/run.mjs`)
- **Env:** `AUTH_URL`, `USER_URL`, `JOB_URL` (defaults: localhost 3001-3003)
- **Idempotent:** Skips existing users (ConflictException)

### 7. Root Scripts & Configuration

**Added to `package.json`:**
- `build:packages` – includes `@onsite360/ui`
- `dev:admin`, `dev:worker`, `dev:employer` – run individual web apps
- `dev:web` – run all three web apps with concurrently
- `seed` – run seed script

**Test fixes:**
- `packages/schemas` – added `--passWithNoTests` (no tests yet)
- `apps/user-management-service` – added `--passWithNoTests`
- `apps/job-service` – added `--passWithNoTests`
- `apps/auth-service/jest.config.js` – fixed moduleNameMapper paths (rootDir relative)
- `apps/auth-service/auth.service.spec.ts` – removed unused imports

**Documentation:**
- Updated `README.md` with web apps, seed, admin secret, build commands
- Added `docs/WEB_APPS.md` – architecture, features, environment, usage
- Added `QUICK_START.md` – 5-step setup guide

---

## Test Results

All tests pass:

| Package/App | Tests | Status |
|------------|-------|--------|
| `@onsite360/common` | 8 (crypto, pagination) | ✓ PASS |
| `@onsite360/ui` | 3 (LoadingSpinner) | ✓ PASS |
| `auth-service` | 2 (AuthService) | ✓ PASS |
| `@onsite360/schemas` | 0 | ✓ PASS (no tests) |
| `user-management-service` | 0 | ✓ PASS (no tests) |
| `job-service` | 0 | ✓ PASS (no tests) |

**Total:** 13 tests, all passing

---

## Build Results

All packages and apps build successfully:

```
Packages:
- @onsite360/types ✓
- @onsite360/common ✓
- @onsite360/schemas ✓
- @onsite360/ui ✓

Backend Services:
- auth-service ✓
- user-management-service ✓
- job-service ✓

Web Apps:
- admin-dashboard ✓ (8 routes)
- worker-app ✓ (10 routes)
- employer-app ✓ (10 routes)
```

---

## Running Status

### Backend Services (port 3001-3003)
All services healthy and running:
- Auth Service: ✓ OK
- User Management: ✓ OK
- Job Service: ✓ OK

### Web Apps (port 3004-3006)
All apps running and responding:
- Admin Dashboard (3004): ✓ HTTP 200
- Worker App (3005): ✓ HTTP 200
- Employer App (3006): ✓ HTTP 200

### Sample Data
Seed script successfully created:
- 3 workers (1 existed, 2 new)
- 3 employers
- 6 published jobs
- 4 applications

---

## Key Implementation Decisions

1. **Monorepo integration:** Used existing pnpm workspace; all new apps/packages added to workspace automatically
2. **Shared UI:** Single source of truth for components, auth, GraphQL client; Next.js transpiles via `transpilePackages`
3. **Tailwind CSS:** Configured in each app; scans `packages/ui/src` for class names
4. **SSR:** Next.js App Router with server components for static content; client components for forms/auth
5. **Auth:** React Context with localStorage; tokens passed via `Authorization` header to backend GraphQL
6. **Admin security:** Header-based (`X-Admin-Secret`) rather than role/claims (simpler, can be upgraded to JWT claims later)
7. **Validation:** Backend uses JSON Schema (AJV); web apps can optionally fetch schemas from Auth Service for client-side validation (not yet implemented in UI but available)
8. **Testing:** Unit tests for shared packages; integration tests are manual via GraphQL Playground and web UI

---

## Architecture Highlights

- **Clean separation:** Each app is self-contained (own routing, pages, components) but shares UI and types
- **Modular:** Worker and employer apps have similar structure but different features; easy to extend
- **Type-safe:** Full TypeScript across monorepo (strict mode); shared types from `@onsite360/types`
- **GraphQL-first:** All backend APIs are GraphQL; web apps use simple fetch (no Apollo Client complexity)
- **Reusable:** `@onsite360/ui` can be used by any future React/Next.js app in the monorepo

---

## Future Work

See [`docs/WEB_APPS.md`](./docs/WEB_APPS.md#future-enhancements) for planned features:
- Geolocation search (lat/lng + radius)
- Workers directory for employers
- File uploads (resume, avatar, logo)
- Real-time notifications
- E2E tests (Playwright/Cypress)
- Admin roles and permissions
