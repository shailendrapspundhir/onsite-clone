# Start all
docker build -t onsite360-dev .
docker run -it --rm \
  -p 5432:5432 \
  -p 6379:6379 \
  -p 9200:9200 \
  -p 9300:9300 \
  -p 3001:3001 \
  -p 3002:3002 \
  -p 3003:3003 \
  -p 3004:3004 \
  -p 3005:3005 \
  -p 3006:3006 \
  onsite360-dev

# How to Start
Start postgres and redis containers.
```bash
docker compose up -d 
```

Start all backend services
```bash
pnpm dev:all
```

Seed data in another terminal
```bash
pnpm seed
```

Start all web apps in another terminal
```bash
pnpm dev:web
```


# OnSite360 Backend

Modular NestJS backend with **PostgreSQL**, **Redis**, and **GraphQL** for the OnSite360 platform. Built as a **monorepo** with shared types and common logic usable by frontend and services.

## Architecture

- **Monorepo** (pnpm workspaces): shared packages + three NestJS microservices
- **Authentication Service** (`apps/auth-service`): OAuth, email/password with OTP (TOTP), mobile OTP, sessions, JWT
- **User Management Service** (`apps/user-management-service`): Worker and Employer profiles, authorization by user type
- **Job/Opportunity Service** (`apps/job-service`): Job postings, applications, search, matching
- **Shared packages**: `@onsite360/types`, `@onsite360/common` (validation, crypto, OTP, pagination, sanitization)

## Tech Stack

| Layer        | Choice                    |
|-------------|---------------------------|
| Language    | TypeScript (strict)       |
| Framework   | NestJS                    |
| API         | GraphQL (code-first)     |
| Database    | PostgreSQL (TypeORM)      |
| Caching     | Redis                     |
| Auth        | JWT, bcrypt, TOTP (otplib)|
| Validation  | class-validator           |

## Project Structure

```
onsite360/
├── packages/
│   ├── types/          # @onsite360/types – shared types, enums, constants
│   ├── common/         # @onsite360/common – validation DTOs, crypto, OTP, pagination
│   ├── schemas/        # @onsite360/schemas – JSON Schema validation (AJV)
│   └── ui/             # @onsite360/ui – shared React components, Auth context, GraphQL client
├── apps/
│   ├── auth-service/             # Port 3001
│   ├── user-management-service/ # Port 3002
│   ├── job-service/             # Port 3003
│   ├── admin-dashboard/         # Port 3004 – Next.js admin (users, add user)
│   ├── worker-app/              # Port 3005 – Next.js worker (profile, jobs, apply)
│   └── employer-app/            # Port 3006 – Next.js employer (profile, my jobs, applicants)
├── scripts/
│   └── seed/           # Sample data script (run after backend is up)
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## Prerequisites

- Node.js 18+
- pnpm 10+
- PostgreSQL 14+
- Redis 6+

## Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Build shared packages**

   ```bash
   pnpm build:packages
   ```

3. **Databases**

   Create three databases (or use one DB with three schemas if you prefer):

   - `onsite360_auth`
   - `onsite360_users`
   - `onsite360_jobs`

4. **Environment**

   Copy `.env.example` in each app and set values:

   - `apps/auth-service/.env.example` → `.env`
   - `apps/user-management-service/.env.example` → `.env`
   - `apps/job-service/.env.example` → `.env`

   Use the same `JWT_ACCESS_SECRET` (and `JWT_REFRESH_SECRET` where applicable) across services that validate tokens.

5. **Run services**

   ```bash
   pnpm dev:auth    # Auth – http://localhost:3001/graphql
   pnpm dev:user   # User Management – http://localhost:3002/graphql
   pnpm dev:job    # Job – http://localhost:3003/graphql
   ```

   Or run all three backends: `pnpm dev:all`

6. **Seed sample data** (optional, for web apps)

   With all three backend services running:

   ```bash
   pnpm seed
   ```

   Creates workers (`worker1@example.com`, …), employers (`employer1@example.com`, …), profiles, and published jobs. Password for all: `Password123!`

7. **Run web apps**

   Copy `.env.example` to `.env` in each web app (or set `NEXT_PUBLIC_*` in env). Then:

   ```bash
   pnpm dev:admin    # Admin dashboard – http://localhost:3004
   pnpm dev:worker   # Worker app – http://localhost:3005
   pnpm dev:employer # Employer app – http://localhost:3006
   ```

   Or run all three: `pnpm dev:web`

   **Admin dashboard**: Set `ADMIN_SECRET` in auth-service `.env` and `NEXT_PUBLIC_ADMIN_SECRET` in admin-dashboard `.env` (same value) to list users.

## GraphQL

- Each app exposes a **GraphQL** endpoint at `/graphql` with **Apollo Playground** and **introspection**.
- Schema is generated under `src/schema.gql` in each app (code-first).

### Auth Service

- **Mutations**: `registerWithEmail`, `loginWithEmail`, `sendOtp`, `verifyOtpAndLogin`, `refreshTokens`, `logout`
- **Queries**: `health`, `users(input)` (admin only; requires `X-Admin-Secret` header)

### User Management Service

- **Worker**: `workerProfile(userId)`, `workerProfileById(id)`, `createWorkerProfile`, `updateWorkerProfile` (auth required)
- **Employer**: `employerProfile(userId)`, `employerProfileById(id)`, `createEmployerProfile`, `updateEmployerProfile` (auth required)
- **Query**: `health`

### Job Service

- **Jobs**: `job(id)`, `jobsSearch(input)` (supports `sortBy`, `sortOrder`), `myJobs` (auth), `createJob`, `updateJob`, `publishJob` (auth)
- **Applications**: `applyToJob`, `updateApplicationStatus`, `applicationsForJob`, `myApplications` (auth)
- **Query**: `health`

Protected operations expect header: `Authorization: Bearer <accessToken>`.

## Security

- **Passwords**: bcrypt (salt rounds 12)
- **JWT**: Access + refresh tokens; refresh stored hashed in DB
- **OTP**: TOTP (otplib) for email/mobile OTP
- **Input**: Validation via `class-validator`; sanitization helpers in `@onsite360/common`
- **Rate limiting**: Throttler (e.g. 100 req/min per app)
- Use **HTTPS** and strong secrets in production

## Caching (Redis)

- Auth: token cache TTL
- User Management: worker/employer profile TTL
- Job: job by ID and search result TTL

## Testing

```bash
pnpm test          # All packages/apps
pnpm test:unit     # Unit tests
pnpm test:e2e      # E2E (when configured)
```

## Build

```bash
pnpm build         # All (packages + services + web apps)
pnpm build:packages # types, common, schemas, ui
pnpm build:auth
pnpm build:user
pnpm build:job
# Next.js apps: pnpm --filter admin-dashboard build, etc.
```

---

## Web Applications

See [`docs/WEB_APPS.md`](./docs/WEB_APPS.md) for details on the three Next.js apps:
- **Admin dashboard** (port 3004) – view users, add accounts
- **Worker app** (port 3005) – profile, job search, apply, track applications
- **Employer app** (port 3006) – profile, post jobs, manage applicants

**Quick start:**
```bash
pnpm seed     # Create sample data (after backends are up)
pnpm dev:web  # Start admin, worker, employer apps
```

---

## License

ISC
