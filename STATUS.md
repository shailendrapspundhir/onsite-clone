# OnSite360 Platform – Current Status

## ✅ All Services Running

### Backend Services (GraphQL APIs)
- **Auth Service** – http://localhost:3001/graphql ✓
- **User Management Service** – http://localhost:3002/graphql ✓
- **Job Service** – http://localhost:3003/graphql ✓

### Web Applications (Next.js)
- **Admin Dashboard** – http://localhost:3004 ✓
- **Worker App** – http://localhost:3005 ✓
- **Employer App** – http://localhost:3006 ✓

---

## ✅ Sample Data (from seed script)

### Test Accounts
All use password: **`Password123!`**

**Workers:**
- `worker2@example.com`
- `worker3@example.com`

**Employers:**
- `employer1@example.com` (CleanCo)
- `employer2@example.com` (SecureGuard Inc)
- `employer3@example.com` (KitchenPro)

### Published Jobs
6 jobs total across various roles (CLEANER, SECURITY_GUARD, COOK, RECEPTIONIST, DRIVER)

### Applications
4 applications from workers to jobs

---

## ✅ Tests Passing

| Package/Service | Tests | Status |
|----------------|-------|--------|
| `@onsite360/common` | 8 | ✓ PASS |
| `@onsite360/ui` | 3 | ✓ PASS |
| `auth-service` | 2 | ✓ PASS |
| All others | 0 | ✓ PASS (no tests) |

**Total: 13 tests, all passing**

---

## ✅ Builds Complete

All packages, services, and web apps build successfully:
- Packages: types, common, schemas, ui
- Services: auth, user-management, job
- Web apps: admin-dashboard, worker-app, employer-app

---

## Quick Actions

### View the apps:
- **Admin:** http://localhost:3004 – Login with any user; view users list; add users
- **Worker:** http://localhost:3005 – Login as worker; search jobs; apply
- **Employer:** http://localhost:3006 – Login as employer; post jobs; view applicants

### Try the GraphQL APIs:
- **Auth:** http://localhost:3001/graphql (Playground enabled)
- **User Management:** http://localhost:3002/graphql
- **Job Service:** http://localhost:3003/graphql

### Run commands:
```bash
pnpm test           # Run all tests
pnpm build          # Build everything
pnpm seed           # Re-run seed script (adds more users/jobs)
pnpm dev:all        # Restart backend services
pnpm dev:web        # Restart web apps
```

---

## Documentation

- [`README.md`](./README.md) – Main project overview
- [`QUICK_START.md`](./QUICK_START.md) – 5-step setup guide
- [`docs/GRAPHQL_API.md`](./docs/GRAPHQL_API.md) – All GraphQL operations
- [`docs/VALIDATION_SCHEMAS.md`](./docs/VALIDATION_SCHEMAS.md) – JSON Schema validation
- [`docs/WEB_APPS.md`](./docs/WEB_APPS.md) – Web app architecture and features
- [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) – What was built and how

---

## Features Implemented

### Admin Dashboard
✅ Login  
✅ Users list with filter (userType) and pagination  
✅ Add user (create worker or employer accounts)  
✅ Admin secret protection for users list  

### Worker App
✅ Login/Register  
✅ Worker profile (create/update)  
✅ Job search (query, role, employment type, location, pagination)  
✅ Job detail with employer info  
✅ Apply to job with cover message  
✅ My applications list with status tracking  

### Employer App
✅ Login/Register  
✅ Employer profile (create/update)  
✅ My jobs list (all statuses)  
✅ Create job (saved as draft)  
✅ Publish job  
✅ View applicants per job  
✅ Update application status (Pending → Shortlisted/Rejected/Hired)  
✅ Worker profiles in applicant view  

### Shared
✅ `@onsite360/ui` package (components, auth, GraphQL client)  
✅ Tailwind CSS styling  
✅ Server-side rendering (Next.js App Router)  
✅ Authentication (JWT tokens, localStorage, auth context)  
✅ Monorepo integration (pnpm workspace)  
✅ Seed script for sample data  
✅ Unit tests for shared packages  

---

## Known Limitations / Future Enhancements

- **Geolocation search:** Jobs have location (string) but no lat/lng for radius filtering
- **Sort by date:** Backend supports `sortBy` (PUBLISHED_AT, CREATED_AT, TITLE); UI can add dropdown
- **Browse workers:** Employer can only see workers who applied; no "search all workers" API
- **File uploads:** Resume/avatar/logo URLs are text fields; no upload flow
- **E2E tests:** Manual testing via UI; integration tests not automated
- **Admin permissions:** Admin uses header secret; no role-based access control (yet)
- **Real-time:** No WebSocket/SSE for live updates

See [`docs/WEB_APPS.md`](./docs/WEB_APPS.md#future-enhancements) for details.

---

## Summary

**Fully functional platform** with:
- 3 backend microservices (GraphQL)
- 3 web applications (Next.js SSR)
- Shared component library
- Sample data and accounts
- Complete authentication flow
- Worker job search and application
- Employer job posting and hiring
- Admin user management

**All tests pass. All services running. Ready for demo or further development.**
