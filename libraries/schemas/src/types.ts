/**
 * Extended JSON Schema document with API-specific error messages and codes.
 * Reusable in APIs (AJV) and web apps (form validation, i18n).
 */
export interface ValidationSchemaDoc {
  /** JSON Schema $id - unique schema name (e.g. "auth.register") */
  $id: string;
  /** JSON Schema type */
  type?: 'object' | 'string' | 'number' | 'array' | 'boolean' | 'null';
  /** JSON Schema properties (for type object) */
  properties?: Record<string, ValidationSchemaDoc | { type: string; [k: string]: unknown }>;
  /** Required property names */
  required?: string[];
  /** Nested schema for array items */
  items?: ValidationSchemaDoc | { type: string; [k: string]: unknown };
  /** Enum values */
  enum?: unknown[];
  /** Format (email, date-time, etc.) */
  format?: string;
  /** Min length (string/array) */
  minLength?: number;
  /** Max length */
  maxLength?: number;
  /** Min (number) */
  minimum?: number;
  /** Max (number) */
  maximum?: number;
  /** Pattern (regex string) */
  pattern?: string;
  /** Allow additional properties */
  additionalProperties?: boolean;
  /** Standard JSON Schema */
  [keyword: string]: unknown;

  /** Human-readable error messages per property and keyword (for APIs and forms) */
  errorMessages?: {
    properties?: Record<string, Record<string, string>>;
    required?: string;
    _?: Record<string, string>;
  };

  /** Machine-readable error codes per property and keyword (for APIs and clients) */
  errorCodes?: {
    properties?: Record<string, Record<string, string>>;
    required?: string;
    _?: Record<string, string>;
  };
}

/** Result of validate() with standardized errors for API responses */
export interface ValidationErrorItem {
  /** JSON path (e.g. "/email") */
  instancePath: string;
  /** Schema path / keyword (e.g. "format", "minLength") */
  keyword: string;
  /** Human-readable message */
  message: string;
  /** Error code (e.g. "AUTH_001") */
  code: string;
  /** Optional params from schema */
  params?: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrorItem[];
}

/** Source that can load a schema by name */
export interface ISchemaSource {
  name: string;
  getSchema(schemaId: string): Promise<ValidationSchemaDoc | null>;
  /** Optional: list available schema IDs */
  listSchemaIds?(): Promise<string[]>;
}
