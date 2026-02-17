# Quick Start Guide – OnSite360 Platform

Complete setup in 5 steps to run all backend services and three web applications.

---

## Prerequisites

- **Node.js** 18+ (v20.9+ recommended for Next.js 14+)
- **pnpm** 10+
- **Docker** (for PostgreSQL and Redis)
- **PostgreSQL** 14+
- **Redis** 6+

---

## Step 1: Install Dependencies

```bash
pnpm install
```

---

## Step 2: Start Docker Services

PostgreSQL and Redis via docker-compose:

```bash
docker compose up -d
```

This creates three databases:
- `onsite360_auth`
- `onsite360_users`
- `onsite360_jobs`

---

## Step 3: Build Shared Packages

```bash
pnpm build:packages
```

Builds:
- `@onsite360/types` (enums, interfaces)
- `@onsite360/common` (validation, crypto, OTP, pagination)
- `@onsite360/schemas` (AJV JSON Schema validation)
- `@onsite360/ui` (React components, Auth context, GraphQL client)

---

## Step 4: Configure Environment

Copy `.env.example` to `.env` in each backend app:

```bash
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/user-management-service/.env.example apps/user-management-service/.env
cp apps/job-service/.env.example apps/job-service/.env
```

**For admin dashboard** (to enable users list), set the same `ADMIN_SECRET` in:
- `apps/auth-service/.env` → `ADMIN_SECRET=your-secret-here`
- `apps/admin-dashboard/.env` → `NEXT_PUBLIC_ADMIN_SECRET=your-secret-here`

Web apps already have `.env` files created (defaults point to localhost).

---

## Step 5: Run Everything

### Start backend services (ports 3001, 3002, 3003):

```bash
pnpm dev:all
```

Wait ~10 seconds for all three services to start. Check health:

```bash
curl http://localhost:3001/graphql -H "Content-Type: application/json" -d '{"query":"{ health { status } }"}'
curl http://localhost:3002/graphql -H "Content-Type: application/json" -d '{"query":"{ health { status } }"}'
curl http://localhost:3003/graphql -H "Content-Type: application/json" -d '{"query":"{ health { status } }"}'
```

### Seed sample data:

```bash
pnpm seed
```

Creates:
- 3 workers: `worker1@example.com`, `worker2@example.com`, `worker3@example.com`
- 3 employers: `employer1@example.com`, `employer2@example.com`, `employer3@example.com`
- 6 published jobs (various roles)
- 4 job applications

Password for all: **`Password123!`**

### Start web apps (ports 3004, 3005, 3006):

In a new terminal:

```bash
pnpm dev:web
```

Or run individually:

```bash
pnpm dev:admin     # Admin dashboard – http://localhost:3004
pnpm dev:worker    # Worker app – http://localhost:3005
pnpm dev:employer  # Employer app – http://localhost:3006
```

---

## Verify

Open in your browser:

1. **Admin dashboard:** http://localhost:3004  
   - Login with any user (e.g., `worker1@example.com` / `Password123!`)
   - Go to `/dashboard/users` to see all users (requires `ADMIN_SECRET` in env)
   - Add a new user via `/dashboard/add-user`

2. **Worker app:** http://localhost:3005  
   - Login: `worker2@example.com` / `Password123!`
   - Create or edit profile (`/dashboard/profile`)
   - Search jobs (`/dashboard/jobs`)
   - View job detail and apply (`/dashboard/jobs/[id]`)
   - Check applications (`/dashboard/applications`)

3. **Employer app:** http://localhost:3006  
   - Login: `employer1@example.com` / `Password123!`
   - Create or edit company profile (`/dashboard/profile`)
   - View your jobs (`/dashboard/jobs`)
   - Create a new job (`/dashboard/jobs/new`)
   - View applicants and update status (`/dashboard/jobs/[id]`)

---

## Testing

Run all unit tests:

```bash
pnpm test
```

Tests:
- `@onsite360/common` – 8 tests (crypto, pagination)
- `@onsite360/ui` – 3 tests (LoadingSpinner component)
- `auth-service` – 2 tests (AuthService)

---

## Stopping

1. **Stop web apps:** Ctrl+C in the terminal running `pnpm dev:web`
2. **Stop backends:** Ctrl+C in the terminal running `pnpm dev:all`
3. **Stop Docker:** `docker compose down`

---

## Troubleshooting

**Port conflicts:**
- Backends use 3001, 3002, 3003
- Web apps use 3004, 3005, 3006
- If ports are in use: `lsof -ti:3001,3002,3003,3004,3005,3006 | xargs -r kill -9`

**Schema validation errors:**
- Check that backends are using the latest `@onsite360/schemas` build
- Restart backends after building schemas: `pnpm build:packages && pnpm dev:all`

**Authentication issues:**
- Ensure `JWT_ACCESS_SECRET` is the same in auth-service, user-management, and job-service `.env`
- Admin users list requires `ADMIN_SECRET` and `NEXT_PUBLIC_ADMIN_SECRET` to match

**Web app 404s:**
- Ensure backends are running and reachable (check `NEXT_PUBLIC_*_GRAPHQL_URL` in web app `.env`)
- Clear browser storage if auth tokens are stale

---

## Next Steps

- Review [`docs/GRAPHQL_API.md`](./docs/GRAPHQL_API.md) for all mutations and queries
- Review [`docs/VALIDATION_SCHEMAS.md`](./docs/VALIDATION_SCHEMAS.md) for form validation
- Review [`docs/WEB_APPS.md`](./docs/WEB_APPS.md) for web app architecture and features
- Add integration tests (Playwright/Cypress)
- Deploy to production (set strong secrets, use HTTPS, disable introspection)
