import type { ValidationSchemaDoc } from '@onsite360/schemas';

export type ValidationErrorItem = {
  instancePath?: string;
  keyword?: string;
  params?: any;
  message?: string;
  code?: string;
};

export type FieldMeta = {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | string;
  required: boolean;
  enum?: unknown[];
  format?: string;
};

export function schemaToFields(doc: ValidationSchemaDoc): FieldMeta[] {
  if (!doc || doc.type !== 'object' || !doc.properties) return [];
  const required = new Set(doc.required ?? []);
  return Object.entries(doc.properties).map(([k, v]) => {
    const prop = v as ValidationSchemaDoc;
    const type = prop.type ?? (prop.enum ? 'string' : 'string');
    const fm: FieldMeta = {
      name: k,
      label: (k.charAt(0).toUpperCase() + k.slice(1)).replace(/([A-Z])/g, ' $1').trim(),
      type: prop.enum ? 'enum' : (type as FieldMeta['type']),
      required: required.has(k),
      enum: prop.enum,
      format: prop.format as string | undefined,
    };
    return fm;
  });
}

/** Map server-side validation errors (ValidationErrorItem[]) to field -> message map */
export function mapServerValidationErrors(errors: ValidationErrorItem[] | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!errors || !errors.length) return out;
  for (const e of errors) {
    let name = (e.instancePath || '').replace(/^\//, '');
    if (e.keyword === 'required' && e.params && typeof e.params.missingProperty === 'string') {
      name = e.params.missingProperty as string;
    }
    if (!name) continue;
    out[name] = e.message ?? String(e.code ?? 'Invalid');
  }
  return out;
}

