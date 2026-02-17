import Ajv, { type ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import type { ValidationSchemaDoc, ValidationErrorItem, ValidationResult } from './types';

/** Strip custom keys before passing to AJV (it only understands JSON Schema) */
function toPureJsonSchema(doc: ValidationSchemaDoc): Record<string, unknown> {
  const { errorMessages, errorCodes, ...rest } = doc;
  return rest as Record<string, unknown>;
}

/** Resolve message for a single error from schema errorMessages */
function getMessage(
  doc: ValidationSchemaDoc,
  instancePath: string,
  keyword: string,
  params?: Record<string, unknown>,
): string {
  const props = doc.errorMessages?.properties;
  // AJV "required" has params.missingProperty
  const path =
    (keyword === 'required' && typeof params?.missingProperty === 'string'
      ? params.missingProperty
      : instancePath.replace(/^\//, '').split('/')[0]) || '';
  const byProp = (path && props?.[path]) as Record<string, string> | undefined;
  const msg = (byProp && byProp[keyword]) ?? (doc.errorMessages?._ as Record<string, string> | undefined)?.[keyword];
  if (msg) return msg;
  if (keyword === 'required') return doc.errorMessages?.required ?? 'This field is required';
  if (keyword === 'format') return 'Invalid format';
  if (keyword === 'minLength') return `Must be at least ${params?.limit ?? '?'} characters`;
  if (keyword === 'maxLength') return `Must be at most ${params?.limit ?? '?'} characters`;
  return `Validation failed: ${keyword}`;
}

/** Resolve error code for a single error from schema errorCodes */
function getCode(
  doc: ValidationSchemaDoc,
  instancePath: string,
  keyword: string,
  params?: Record<string, unknown>,
): string {
  const props = doc.errorCodes?.properties;
  const path =
    (keyword === 'required' && typeof params?.missingProperty === 'string'
      ? params.missingProperty
      : instancePath.replace(/^\//, '').split('/')[0]) || '';
  const byProp = (path && props?.[path]) as Record<string, string> | undefined;
  const code = (byProp && byProp[keyword]) ?? (doc.errorCodes?._ as Record<string, string> | undefined)?.[keyword];
  return code ?? 'VALIDATION_ERROR';
}

/** Build ValidationErrorItem[] from AJV errors and schema doc */
function mapErrors(
  doc: ValidationSchemaDoc,
  ajvErrors: ErrorObject[] | null,
): ValidationErrorItem[] {
  if (!ajvErrors?.length) return [];
  return ajvErrors.map((e) => {
    const params = e.params as Record<string, unknown> | undefined;
    return {
      instancePath: e.instancePath || '/',
      keyword: e.keyword,
      message: getMessage(doc, e.instancePath || '/', e.keyword, params),
      code: getCode(doc, e.instancePath || '/', e.keyword, params),
      params: e.params,
    };
  });
}

let defaultAjv: Ajv | null = null;
const compiledSchemas = new Map<string, ReturnType<Ajv['compile']>>();

function getAjv(): Ajv {
  if (!defaultAjv) {
    defaultAjv = new Ajv({ allErrors: true, strict: false });
    addFormats(defaultAjv);
  }
  return defaultAjv;
}

/**
 * Validate data against a schema document (with errorMessages and errorCodes).
 * Returns standardized errors for API and form use.
 */
export function validateWithSchema(
  doc: ValidationSchemaDoc,
  data: unknown,
): ValidationResult {
  const schemaId = (doc.$id as string) || 'schema';
  const pure = toPureJsonSchema(doc);
  try {
    let validate = compiledSchemas.get(schemaId);
    if (!validate) {
      const ajv = getAjv();
      validate = ajv.compile({ ...pure, $id: schemaId });
      compiledSchemas.set(schemaId, validate);
    }
    const valid = validate(data);
    const errors = mapErrors(doc, validate.errors ?? null);
    return { valid: !!valid, errors };
  } catch (err) {
    return {
      valid: false,
      errors: [
        {
          instancePath: '/',
          keyword: 'compile',
          message: err instanceof Error ? err.message : 'Schema compilation failed',
          code: 'SCHEMA_ERROR',
        },
      ],
    };
  }
}
