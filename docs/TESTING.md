# Testing Guide

Comprehensive testing strategy for the OnSite360 platform.

---

## Test Overview

| Type | Coverage | Tools |
|------|----------|-------|
| **Unit** | Shared packages, services | Jest, ts-jest |
| **Component** | UI components | Jest, React Testing Library, jsdom |
| **Integration** | GraphQL APIs | Manual (Playground), future: supertest |
| **E2E** | Web apps | Manual, future: Playwright/Cypress |

---

## Running Tests

### All Tests
```bash
pnpm test
```

Runs tests in all packages/apps that have a `test` script. Currently:
- `@onsite360/common` (8 tests)
- `@onsite360/ui` (3 tests)
- `auth-service` (2 tests)
- Others pass with no tests

### Individual Package Tests
```bash
pnpm --filter @onsite360/common test
pnpm --filter @onsite360/ui test
pnpm --filter auth-service test
```

### Watch Mode (during development)
```bash
cd packages/ui && pnpm test -- --watch
```

---

## Unit Tests

### `@onsite360/common` (8 tests)
**File:** `packages/common/src/crypto.spec.ts`
- `hashPassword()` – bcrypt hashing (mocked for speed)
- `verifyPassword()` – password verification
- `hashRefreshToken()` – SHA-256 hash for refresh tokens

**File:** `packages/common/src/pagination.spec.ts`
- `normalizePagination()` – page/pageSize normalization with min/max
- `buildPaginatedResult()` – result wrapper with totalPages, hasNext, hasPrevious

**Run:** `pnpm --filter @onsite360/common test`

### `@onsite360/ui` (3 tests)
**File:** `packages/ui/src/components/LoadingSpinner.spec.tsx`
- Renders with default size (md)
- Renders with size sm
- Has accessible label ("Loading...")

**Run:** `pnpm --filter @onsite360/ui test`

### `auth-service` (2 tests)
**File:** `apps/auth-service/src/auth/auth.service.spec.ts`
- `AuthService` is defined
- `loginWithEmail()` throws when user not found

**Run:** `pnpm --filter auth-service test`

---

## Integration Tests (Manual)

### GraphQL Playground
Each service exposes a GraphQL Playground at `/graphql`:
- Auth: http://localhost:3001/graphql
- User Management: http://localhost:3002/graphql
- Job: http://localhost:3003/graphql

**Example flows:**

1. **Register → Create Profile → Create Job**
   ```graphql
   # Auth Service
   mutation {
     registerWithEmail(input: {
       email: "employer@test.com"
       password: "Password123!"
       userType: "EMPLOYER"
     }) {
       accessToken
       user { id }
     }
   }
   
   # User Management (with accessToken in headers)
   mutation {
     createEmployerProfile(input: {
       companyName: "Test Co"
       contactEmail: "employer@test.com"
       desiredRoles: ["CLEANER"]
     }) {
       id companyName
     }
   }
   
   # Job Service (with accessToken)
   mutation {
     createJob(input: {
       title: "Test Job"
       description: "Test description"
       role: "CLEANER"
       employmentType: "FULL_TIME"
       location: "Test City"
     }) {
       id
     }
   }
   
   mutation {
     publishJob(id: "<jobId>") {
       id status publishedAt
     }
   }
   ```

2. **Worker → Search → Apply**
   ```graphql
   # Auth Service
   mutation {
     loginWithEmail(input: {
       email: "worker2@example.com"
       password: "Password123!"
     }) {
       accessToken
     }
   }
   
   # Job Service
   query {
     jobsSearch(input: {
       role: "CLEANER"
       location: "New York"
       page: 1
       pageSize: 10
     }) {
       items {
         id title location employerId
       }
       total
     }
   }
   
   # Job Service (with accessToken)
   mutation {
     applyToJob(input: {
       jobId: "<jobId>"
       coverMessage: "I'm interested"
     }) {
       id status appliedAt
     }
   }
   ```

3. **Employer → View Applicants → Update Status**
   ```graphql
   # Job Service (with employer accessToken)
   query {
     applicationsForJob(jobId: "<jobId>") {
       items {
         id workerId status appliedAt
       }
     }
   }
   
   # User Management
   query {
     workerProfile(userId: "<workerId>") {
       firstName lastName skills location
     }
   }
   
   # Job Service
   mutation {
     updateApplicationStatus(
       applicationId: "<appId>"
       input: { status: "SHORTLISTED" }
     ) {
       id status
     }
   }
   ```

---

## E2E Tests (Manual via Web Apps)

### Admin Dashboard Flow
1. Open http://localhost:3004
2. Login with `worker2@example.com` / `Password123!`
3. Navigate to `/dashboard/users`
4. Verify users list renders (requires `ADMIN_SECRET` in env)
5. Navigate to `/dashboard/add-user`
6. Create a new worker or employer
7. Verify user appears in list

### Worker Flow
1. Open http://localhost:3005
2. Register a new worker or login with `worker2@example.com` / `Password123!`
3. Navigate to `/dashboard/profile` and create/update profile
4. Navigate to `/dashboard/jobs` and search (e.g., role: CLEANER, location: New York)
5. Click a job to view details
6. Submit an application
7. Navigate to `/dashboard/applications` and verify application appears

### Employer Flow
1. Open http://localhost:3006
2. Register a new employer or login with `employer1@example.com` / `Password123!`
3. Navigate to `/dashboard/profile` and create/update profile
4. Navigate to `/dashboard/jobs/new` and create a job
5. Navigate to `/dashboard/jobs` and verify job appears (draft)
6. Click job, then "Publish job"
7. Wait for worker to apply (or manually create application via GraphQL)
8. Refresh job detail and verify applicant appears
9. Update application status (e.g., Pending → Shortlisted)

---

## Future: Automated Integration Tests

### Backend (Supertest)
Create `apps/*/test/*.e2e-spec.ts`:
```typescript
describe('Auth API (e2e)', () => {
  it('should register, login, and refresh', async () => {
    // POST to /graphql with register mutation
    // Assert accessToken in response
    // POST with login mutation
    // POST with refreshTokens mutation
  });
});
```

### Web Apps (Playwright)
Create `apps/*/e2e/*.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test('worker can search and apply', async ({ page }) => {
  await page.goto('http://localhost:3005/login');
  await page.fill('[name="email"]', 'worker2@example.com');
  await page.fill('[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  await page.click('a[href="/dashboard/jobs"]');
  await page.waitForSelector('text=jobs found');
  await page.click('text=View & Apply >> first');
  await page.fill('textarea', 'Test cover message');
  await page.click('text=Submit application');
  await page.waitForSelector('text=Application submitted');
});
```

### Setup (not yet implemented)
```bash
pnpm add -D @playwright/test
pnpm add -D supertest @types/supertest
```

---

## Test Data Management

### Seed Script
- **File:** `scripts/seed/run.mjs`
- **Run:** `pnpm seed`
- **Purpose:** Creates sample users, profiles, jobs, and applications for development and testing
- **Idempotent:** Skips existing users (checks for ConflictException)

### Manual Cleanup
If you need to reset in-memory data, restart the affected service:
```bash
pnpm --filter auth-service dev
# or user-management-service / job-service as needed
```
Running the seed script afterwards will repopulate sample records.

---

## Test Coverage (Current)

- **Crypto:** ✓ hashing, verification
- **Pagination:** ✓ normalization, result builder
- **UI Components:** ✓ LoadingSpinner rendering
- **Auth Service:** ✓ service instantiation, login validation

**Not yet tested (manual only):**
- OTP send/verify
- Worker/Employer profile CRUD
- Job create/update/publish
- Job search filters
- Application flow (apply, status update)
- Admin users list
- Web app forms and navigation

---

## Best Practices

1. **Unit tests:** Test pure functions (crypto, pagination, validators)
2. **Component tests:** Test UI components in isolation (render, props, events)
3. **Integration tests:** Test API endpoints with in-memory DB or test DB
4. **E2E tests:** Test critical user flows end-to-end
5. **Mock external dependencies:** Redis, JWT, bcrypt (for speed)
6. **Use test data:** Seed script or fixtures for realistic scenarios
7. **CI/CD:** Run `pnpm test` in GitHub Actions or similar

---

## Adding New Tests

### Unit Test Example (packages/ui)
```typescript
// packages/ui/src/components/Button.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Click</Button>);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
```

### Service Test Example (auth-service)
```typescript
// apps/auth-service/src/auth/auth.service.spec.ts
it('registers user and returns tokens', async () => {
  mockUserRepo.findOne.mockResolvedValue(null);
  mockUserRepo.create.mockReturnValue({ id: '123', email: 'test@example.com', userType: 'WORKER' });
  mockUserRepo.save.mockResolvedValue({ id: '123' });
  mockCredentialRepo.create.mockReturnValue({ id: 'cred1' });
  mockCredentialRepo.save.mockResolvedValue({ id: 'cred1' });
  mockJwt.signAccess.mockReturnValue('access_token');
  mockJwt.signRefresh.mockReturnValue({ token: 'refresh_token', hash: 'hash' });

  const result = await service.registerWithEmail({
    email: 'test@example.com',
    password: 'Password123!',
    userType: UserType.WORKER,
  });

  expect(result.accessToken).toBe('access_token');
  expect(mockUserRepo.save).toHaveBeenCalled();
});
```

---

## CI/CD Example

**.github/workflows/test.yml:**
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with: { version: 10 }
      - uses: actions/setup-node@v3
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build:packages
      - run: pnpm test
```

---

**Current status:** All implemented tests pass. Ready for additional test coverage.
