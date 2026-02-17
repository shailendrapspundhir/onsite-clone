Schema-driven form renderers

Overview
- The package exposes two basic renderers:
  - `WebFormRenderer` — React/Next.js friendly renderer using existing UI components.
  - `RNFormRenderer` — React Native renderer for mobile apps.

Usage
- Provide a `ValidationSchemaDoc` (JSON schema with `errorMessages`/`errorCodes`) as the `schema` prop.
- Both renderers accept `initialValues` and `onSubmit(values)`.

Examples
- Mobile (React Native): import the schema JSON and use the RN renderer.
- Web (Next.js): import a schema and render `WebFormRenderer` inside a page.

Notes
- These renderers are intentionally small and handle common field types (`string`, `enum`).
- For production you'd wire validation (AJV) using the schema validator and improved field components.
