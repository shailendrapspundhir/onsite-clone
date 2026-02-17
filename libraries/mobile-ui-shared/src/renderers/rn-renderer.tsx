import { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import type { ValidationSchemaDoc } from '@onsite360/schemas';
import { schemaToFields, type FieldMeta } from './schema-utils';

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

export type RNFormRendererProps = {
  schema: ValidationSchemaDoc;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  externalErrors?: Record<string, string>;
};

export function RNFormRenderer({ schema, initialValues = {}, onSubmit, externalErrors }: RNFormRendererProps) {
  const fields = schemaToFields(schema);
  const [values, setValues] = useState<Record<string, any>>(() => ({ ...initialValues }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField(name: string, value: any) {
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
    <View>
      {fields.map((f: FieldMeta) => {
        const displayErrors = { ...(errors ?? {}), ...(externalErrors ?? {}) };
        if (f.type === 'enum' && f.enum) {
          return (
            <View key={f.name} style={{ marginBottom: 12 }}>
              <Text style={styles.label}>{f.label}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {(f.enum as any[]).map((opt) => (
                  <TouchableOpacity key={String(opt)} onPress={() => setField(f.name, opt)} style={{ marginRight: 12 }}>
                    <Text style={{ color: values[f.name] === opt ? 'blue' : 'black' }}>{String(opt)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        }
        return (
          <View key={f.name} style={{ marginBottom: 12 }}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              value={values[f.name] ?? ''}
              onChangeText={(t) => setField(f.name, t)}
              secureTextEntry={f.name.toLowerCase().includes('password')}
              style={styles.input}
            />
              {displayErrors[f.name] ? <Text style={{ color: 'red', marginTop: 6 }}>{displayErrors[f.name]}</Text> : null}
          </View>
        );
      })}
      <Button
        title="Submit"
        onPress={() => {
          const res = validateWithSchema(schema, values);
          if (!res.valid) {
            const m = mapValidationErrors(res);
            setErrors(m);
            return;
          }
          setErrors({});
          void Promise.resolve(onSubmit(values)).catch((e) => console.error(e));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
});

export default RNFormRenderer;
