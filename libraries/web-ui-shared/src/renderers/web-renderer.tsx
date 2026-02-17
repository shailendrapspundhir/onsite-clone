"use client";

import { useState } from 'react';
import type { ValidationSchemaDoc } from '@onsite360/schemas';
import { schemaToFields, type FieldMeta } from './schema-utils';
import { Input, Select, Button, ErrorMessage } from '@onsite360/ui-shared';

function validateWithSchema(schema: ValidationSchemaDoc, data: any) {
  // Minimal client-side validation: required fields only
  const errors: any[] = [];
  if (schema.type === 'object' && schema.required) {
    for (const key of schema.required) {
      if (data[key] === undefined || data[key] === '') {
        errors.push({
          instancePath: `/${key}`,
          message: 'Required',
          params: { missingProperty: key },
        });
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

export type WebFormRendererProps = {
  schema: ValidationSchemaDoc;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  externalErrors?: Record<string, string>;
};

export function WebFormRenderer({ schema, initialValues = {}, onSubmit, externalErrors }: WebFormRendererProps) {
  const fields = schemaToFields(schema);
  const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...initialValues }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField(name: string, value: unknown) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' }));
  }

  function mapValidationErrors(result: { valid: boolean; errors: any[] }) {
    const obj: Record<string, string> = {};
    for (const e of result.errors ?? []) {
      const name = (e.params && (e.params.missingProperty as string)) || (e.instancePath || '').replace(/^\//, '');
      if (!name) continue;
      obj[name] = e.message ?? 'Invalid value';
    }
    return obj;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const res = validateWithSchema(schema, values);
        if (!res.valid) {
          setErrors(mapValidationErrors(res));
          return;
        }
        void Promise.resolve(onSubmit(values)).catch((err) => console.error(err));
      }}
    >
      {fields.map((f: FieldMeta) => {
        const displayErrors = { ...(errors ?? {}), ...(externalErrors ?? {}) };
        if (f.type === 'enum' && f.enum) {
          return (
            <div key={f.name} style={{ marginBottom: 12 }}>
              <label>{f.label}</label>
              <Select value={String(values[f.name] ?? '')} onChange={(v) => setField(f.name, v)} options={(f.enum as any[]).map((x) => ({ label: String(x), value: x }))} />
            </div>
          );
        }
        return (
          <div key={f.name} style={{ marginBottom: 12 }}>
            <label>{f.label}</label>
            <Input value={String(values[f.name] ?? '')} onChange={(v) => setField(f.name, v)} type={f.format === 'email' ? 'email' : f.name.toLowerCase().includes('password') ? 'password' : 'text'} />
            {displayErrors[f.name] ? <ErrorMessage message={displayErrors[f.name]} /> : null}
          </div>
        );
      })}
      <Button type="submit">Submit</Button>
    </form>
  );
}


