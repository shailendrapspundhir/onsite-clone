"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, WebFormRenderer, ErrorMessage, Card, CardHeader, CardTitle, mapServerValidationErrors } from '@onsite360/web-ui-shared';
import { useEffect } from 'react';
import { SchemaFetcher } from '@onsite360/web-ui-shared';
import { UserType } from '@onsite360/types';
import { ValidationSchemaDoc } from '@onsite360/schemas';


export default function RegisterPage() {
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [authSchema, setAuthSchema] = useState<ValidationSchemaDoc | null>(null);
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchSchema() {
      const fetcher = new SchemaFetcher({ baseUrl: process.env.NEXT_PUBLIC_SCHEMA_API_URL ?? 'http://localhost:3001' });
      try {
        const schema = await fetcher.fetchSchema('application/auth');
        setAuthSchema(schema);
      } catch {
        setError('Failed to load schema');
      }
    }
    fetchSchema();
  }, []);

  async function handleSubmit(values: Record<string, unknown>) {
    setError('');
    try {
      await register({
        email: values.email as string,
        password: values.password as string,
        userType: UserType.WORKER,
        firstName: (values.firstName as string) || undefined,
        lastName: (values.lastName as string) || undefined,
      });
      router.replace('/onboarding');
    } catch (err: unknown) {
      // Try extract standardized validation errors from server
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverErrors = (err as any)?.errors ?? (err as any)?.response?.errors ?? (err as any)?.graphQLErrors ?? null;
      if (Array.isArray(serverErrors)) {
        setFieldErrors(mapServerValidationErrors(serverErrors));
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
    }
  }

  if (isAuthenticated) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Worker Registration</CardTitle>
          <p className="mt-1 text-sm text-gray-500">Create an account to search jobs and apply.</p>
        </CardHeader>
        <div className="p-4">
          {error && <ErrorMessage message={error} />}
          {authSchema ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <WebFormRenderer schema={authSchema} onSubmit={handleSubmit} externalErrors={fieldErrors} />
          ) : (
            <p>Loading schema...</p>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
