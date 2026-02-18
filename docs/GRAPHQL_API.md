# GraphQL API Documentation

Each service exposes a GraphQL endpoint at `http://localhost:<PORT>/graphql` with **Apollo Playground** and **introspection** enabled. Use the same base URL for your frontend or API client.

---

## 1. Auth Service (Port 3001)

**Base URL:** `http://localhost:3001/graphql`

### Mutations

| Operation | Description |
|-----------|-------------|
| `registerWithEmail(input: RegisterEmailInput!)` | Register with email, password, and user type (WORKER/EMPLOYER). Returns `AuthPayload`. |
| `loginWithEmail(input: LoginEmailInput!)` | Login with email and password. Returns `AuthPayload`. |
| `sendOtp(input: OtpSendInput!)` | Send OTP to email or phone (channel: EMAIL \| MOBILE). |
| `verifyOtpAndLogin(input: OtpVerifyInput!)` | Verify OTP and return tokens (login/signup). |
| `refreshTokens(input: RefreshTokenInput!)` | Issue new access and refresh tokens. |
| `logout(input: RefreshTokenInput!)` | Invalidate refresh token. |

### Queries

| Operation | Description |
|-----------|-------------|
| `health` | Service health (database, Redis). |

### Types

- **AuthPayload:** `user`, `accessToken`, `refreshToken`, `expiresIn`
- **RegisterEmailInput:** `email`, `password`, `userType`, `firstName?`, `lastName?`
- **LoginEmailInput:** `email`, `password`
- **OtpSendInput:** `channel` (EMAIL \| MOBILE), `email?`, `phone?`
- **OtpVerifyInput:** `channel`, `email?`, `phone?`, `otp` (6 digits)

---

## 2. User Management Service (Port 3002)

**Base URL:** `http://localhost:3002/graphql`

Protected operations require header: `Authorization: Bearer <accessToken>` (from Auth Service).

### Worker

| Operation | Type | Description |
|-----------|------|-------------|
| `workerProfile(userId: String!)` | Query | Get worker profile by user ID (public). |
| `workerProfileById(id: String!)` | Query | Get worker profile by profile ID. |
| `createWorkerProfile(input: CreateWorkerProfileInput!)` | Mutation | Create worker profile (auth). |
| `updateWorkerProfile(input: UpdateWorkerProfileInput!)` | Mutation | Update own profile (auth). |

### Employer

| Operation | Type | Description |
|-----------|------|-------------|
| `employerProfile(userId: String!)` | Query | Get employer profile by user ID. |
| `employerProfileById(id: String!)` | Query | Get employer profile by profile ID. |
| `createEmployerProfile(input: CreateEmployerProfileInput!)` | Mutation | Create employer profile (auth). |
| `updateEmployerProfile(input: UpdateEmployerProfileInput!)` | Mutation | Update own profile (auth). |

### Queries

| Operation | Description |
|-----------|-------------|
| `health` | Service health. |

---

## 3. Job Service (Port 3003)

**Base URL:** `http://localhost:3003/graphql`

Protected operations require `Authorization: Bearer <accessToken>`.

### Jobs

| Operation | Type | Description |
|-----------|------|-------------|
| `job(id: String!)` | Query | Get job by ID. |
| `jobsSearch(input: JobSearchInput!)` | Query | Search published jobs (query, role, location, pagination). |
| `myJobs(page?, pageSize?)` | Query | List jobs for current employer (auth). |
| `createJob(input: CreateJobInput!)` | Mutation | Create job as draft (auth). |
| `updateJob(id: String!, input: UpdateJobInput!)` | Mutation | Update job (auth, owner). |
| `publishJob(id: String!)` | Mutation | Publish job (auth, owner). |

### Applications

| Operation | Type | Description |
|-----------|------|-------------|
| `applyToJob(input: CreateApplicationInput!)` | Mutation | Apply as worker (auth). |
| `updateApplicationStatus(applicationId: String!, input: UpdateApplicationStatusInput!)` | Mutation | Update application status (auth, employer). |
| `withdrawApplication(applicationId: String!)` | Mutation | Withdraw own application (sets WITHDRAWN; auth, worker-owner). |
| `applicationsForJob(jobId: String!, page?, pageSize?)` | Query | List applications for a job (auth, employer). |
| `myApplications(page?, pageSize?)` | Query | List own applications (auth). |

New `withdrawApplication` enables workers to retract (visible in lists for history). Use with `updateApplicationStatus` for employer actions (e.g., to HIRED).

### Queries

| Operation | Description |
|-----------|-------------|
| `health` | Service health. |

### Enums (Job Service)

- **JobStatus:** DRAFT, PUBLISHED, CLOSED, CANCELLED
- **JobRole:** SECURITY_GUARD, COOK, CLEANER, DRIVER, RECEPTIONIST, MAINTENANCE, OTHER
- **EmploymentType:** FULL_TIME, PART_TIME, CONTRACT, TEMPORARY
- **ApplicationStatus:** PENDING, SHORTLISTED, REJECTED, HIRED, WITHDRAWN

---

## Workflow Example

1. **Register / Login** (Auth Service)  
   `mutation { registerWithEmail(input: { email: "worker@example.com", password: "SecurePass1", userType: WORKER }) { accessToken refreshToken expiresIn user { id email userType } } }`

2. **Create Worker Profile** (User Management Service)  
   Header: `Authorization: Bearer <accessToken>`  
   `mutation { createWorkerProfile(input: { firstName: "John", lastName: "Doe", skills: [COOK, CLEANER], availability: [{ role: COOK, employmentType: "FULL_TIME" }] }) { id userId firstName lastName } }`

3. **Search Jobs** (Job Service)  
   `query { jobsSearch(input: { role: COOK, location: "NYC", page: 1, pageSize: 10 }) { items { id title role location } total page totalPages } }`

4. **Apply to Job** (Job Service)  
   Header: `Authorization: Bearer <accessToken>`  
   `mutation { applyToJob(input: { jobId: "<uuid>", coverMessage: "Interested in this role." }) { id status appliedAt } }`

---

## Introspection

You can fetch the full schema from each service using GraphQL introspection (e.g. from Playground or with a client that supports it). The generated schema files are also written to `src/schema.gql` in each app after the first run.
