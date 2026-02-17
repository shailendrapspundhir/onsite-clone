'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  ErrorMessage, 
  graphqlRequestWithRefresh, 
  WebFormRenderer, 
  mapServerValidationErrors, 
  SchemaFetcher 
} from '@onsite360/web-ui-shared';
import getStoredAuth from '../../lib/getStoredAuth';
import { UserType } from '@onsite360/types';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_GRAPHQL_URL ?? 'http://localhost:3001/graphql';

export const dynamic = 'force-dynamic';

export default function AddUserPage() {
  // Removed unused state variables: email, password, userType, firstName, lastName
  const [error, setError] = useState('');
  const [schema, setSchema] = useState<any>(null);
    useEffect(() => {
      const fetchSchema = async () => {
        const fetcher = new SchemaFetcher({ baseUrl: process.env.NEXT_PUBLIC_SCHEMA_API_URL ?? 'http://localhost:3001' });
        try {
          const s = await fetcher.fetchSchema('application/auth');
          setSchema(s);
        } catch (e) {
          setError('Failed to load schema');
        }
      };
      fetchSchema();
    }, []);
  // Removed unused loading state
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  async function handleSubmit(values: Record<string, any>) {
    setError('');
    // Removed unused setLoading
    try {
      await graphqlRequestWithRefresh(
        AUTH_URL,
        `mutation Register($input: RegisterEmailInput!) { registerWithEmail(input: $input) { user { id email userType } } }`,
        {
          input: {
            email: values.email,
            password: values.password,
            userType: values.userType,
            ...(values.firstName ? { firstName: values.firstName } : {}),
            ...(values.lastName ? { lastName: values.lastName } : {}),
          },
        },
        undefined,
        undefined,
        getStoredAuth
      );
      // success if no exception
      setSuccess(true);
      // Removed unused state resets
    } catch (err: any) {
      const serverErrors = err?.errors ?? err?.response?.errors ?? err?.graphQLErrors ?? null;
      if (Array.isArray(serverErrors)) {
        setFieldErrors(mapServerValidationErrors(serverErrors));
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create user');
      }
    } finally {
      // Removed unused setLoading
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add User</CardTitle>
        <p className="mt-1 text-sm text-gray-500">
          Create a new worker or employer account. They can then log in and complete their profile.
        </p>
      </CardHeader>
      <div className="p-4">
        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">User created successfully.</div>
        )}
        {schema && (
          <WebFormRenderer
            schema={schema}
            initialValues={{ userType: UserType.WORKER }}
            onSubmit={handleSubmit}
            externalErrors={fieldErrors}
          />
        )}
        <div className="flex gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </div>
    </Card>
  );
}
