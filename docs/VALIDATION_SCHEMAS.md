# JSON Schema Validation (AJV) – Single JSON for APIs & Web Apps

Validation rules, **error messages**, and **error codes** are defined in a **single JSON structure** per form/API and can be loaded from **multiple sources** (Redis, DB, file system). The same schemas are used in the backend (NestJS) and can be consumed by web apps for forms and client-side validation.

## Package: `@onsite360/schemas`

- **AJV** for JSON Schema validation
- **Extended schema format**: standard JSON Schema + `errorMessages` and `errorCodes` per property/keyword
- **Multi-source loading**: Redis (first), DB (second), file system (fallback)

## Schema Format

Each schema is a JSON document with:

- **$id**: Schema identifier (e.g. `auth.register`, `user.workerProfile`)
- **type**, **properties**, **required**, **format**, **minLength**, **enum**, etc. (standard JSON Schema)
- **errorMessages**: `{ properties: { fieldName: { keyword: "Human message" } }, required: "..." }`
- **errorCodes**: `{ properties: { fieldName: { keyword: "AUTH_001" } }, required: "FIELD_REQUIRED" }`

Example (excerpt from `auth.register`):

```json
{
  "$id": "auth.register",
  "type": "object",
  "required": ["email", "password", "userType"],
  "properties": {
    "email": { "type": "string", "format": "email", "minLength": 1 },
    "password": { "type": "string", "minLength": 8, "maxLength": 128 }
  },
  "errorMessages": {
    "properties": {
      "email": { "format": "Invalid email address", "minLength": "Email is required" },
      "password": { "minLength": "Password must be at least 8 characters" }
    }
  },
  "errorCodes": {
    "properties": {
      "email": { "format": "AUTH_001", "minLength": "AUTH_002" },
      "password": { "minLength": "AUTH_002" }
    }
  }
}
```

## Schema Sources (order of resolution)

1. **Redis** – Key `schema:<schemaId>`, JSON string. Used for caching and runtime overrides.
2. **Database** – Table `validation_schemas` (name, version, schema_json). Admin can store/override schemas.
3. **File system** – Default: `packages/schemas/schemas/*.json`. Shipped with the package.

The registry tries each source in order; the first hit is returned.

## Available Schema IDs (file-based)

| Schema ID             | Description        |
|-----------------------|--------------------|
| `auth.register`      | Email registration |
| `auth.login`          | Email login        |
| `auth.otpSend`       | Send OTP           |
| `auth.otpVerify`     | Verify OTP         |
| `user.workerProfile`  | Worker profile     |
| `user.employerProfile`| Employer profile   |
| `job.create`         | Create job         |
| `job.application`    | Apply to job       |

Global codes and messages: `packages/schemas/schemas/error-codes.json`.

## Backend Usage (NestJS – Auth Service)

- **Schema module** (Auth Service): `SchemaModule` wires Redis + DB + File sources and exposes:
  - **GraphQL**
    - `validationSchema(id: String!)`: returns one schema as JSON string
    - `validationSchemasCatalog`: returns all schemas + error codes/messages as one JSON string (for web apps)
    - `validationSchemaIds`: list of schema IDs
  - **Validation**: `@SchemaValidate('auth.register')` on a resolver method validates `args.input` (or first arg) with the given schema. On failure, throws `BadRequestException` with `errors: [{ instancePath, keyword, message, code }]`.

Example:

```ts
@Mutation(() => AuthPayload)
@SchemaValidate('auth.register')
async registerWithEmail(@Args('input') input: RegisterEmailInput) { ... }
```

## Web App Usage

1. **Fetch one schema**:  
   GraphQL query `validationSchema(id: "auth.register")` → parse JSON, use with your form library or AJV in the browser.

2. **Fetch full catalog**:  
   GraphQL query `validationSchemasCatalog` → single JSON with `schemas`, `errorCodes`, `messages`. Use for all forms and for i18n of error codes.

3. **Validate in browser**:  
   Use the same AJV + schema (without backend-specific keys if needed). Error messages and codes come from the schema/catalog.

## Error Response Shape (API)

When schema validation fails (e.g. via `@SchemaValidate`):

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "instancePath": "/email",
      "keyword": "format",
      "message": "Invalid email address",
      "code": "AUTH_001"
    }
  ]
}
```

## Adding New Schemas

1. Add a new JSON file under `packages/schemas/schemas/` (e.g. `my-form.json`) with `$id` and optional `errorMessages` / `errorCodes`.
2. Register the schema ID in `SCHEMA_ID_TO_FILE` in `packages/schemas/src/sources/file-source.ts` if the filename does not match `schemaId.replace(/\./g, '-')`.
3. Rebuild `@onsite360/schemas`. Optionally store the same JSON in DB or Redis for overrides.

## Build

```bash
pnpm --filter @onsite360/schemas build
# or
pnpm build:packages
```
