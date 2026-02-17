import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RNFormRenderer, mapServerValidationErrors } from '@onsite360/mobile-ui-shared';
import { SchemaFetcher } from '@onsite360/mobile-ui-shared';
import { useAuthStore } from '../store/authStore';

export default function RegisterScreen({ navigation }: any) {
  const register = useAuthStore((s) => s.register);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [schema, setSchema] = React.useState<any>(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchSchema = async () => {
      const fetcher = new SchemaFetcher({ baseUrl: process.env.EXPO_PUBLIC_SCHEMA_API_URL ?? 'http://localhost:3001' });
      try {
        const s = await fetcher.fetchSchema('application/auth');
        setSchema(s);
      } catch (e) {
        setError('Failed to load schema');
      }
    };
    fetchSchema();
  }, []);

  async function onSubmit(values: Record<string, any>) {
    try {
      await register(values as { email: string; password: string; userType: 'WORKER' | 'EMPLOYER' });
    } catch (err) {
      const serverErrors = (err as any)?.errors ?? (err as any)?.response?.errors ?? null;
      if (Array.isArray(serverErrors)) {
        setFieldErrors(mapServerValidationErrors(serverErrors));
      } else {
        console.warn('Register failed', err);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {schema && (
        <RNFormRenderer schema={schema as any} onSubmit={onSubmit} externalErrors={fieldErrors} />
      )}
      <Text style={{ marginTop: 12, color: 'blue' }} onPress={() => navigation.navigate('Login')}>
        Back to Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
});
