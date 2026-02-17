'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, LoadingSpinner, Select, SelectOption, graphqlRequestWithRefresh } from '@onsite360/web-ui-shared';
import { UserType } from '@onsite360/types';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_GRAPHQL_URL ?? 'http://localhost:3001/graphql';
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? '';

interface User {
  id: string;
  email: string;
  userType: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  users: {
    items: User[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

async function fetchUsers(
  page: number,
  pageSize: number,
  userType?: string,
  since?: string
): Promise<UsersResponse['users']> {
  const query = `
    query Users($input: ListUsersInput!) {
      users(input: $input) {
        items { id email userType createdAt updatedAt }
        total page pageSize totalPages hasNext hasPrevious
      }
    }
  `;
  const variables: Record<string, unknown> = {
    input: { page, pageSize },
  };
  if (userType) (variables.input as Record<string, unknown>).userType = userType;
  if (since) (variables.input as Record<string, unknown>).since = since;

  const data = await graphqlRequestWithRefresh<UsersResponse>(
    AUTH_URL,
    query,
    variables,
    null,
    ADMIN_SECRET ? { 'X-Admin-Secret': ADMIN_SECRET } : undefined
  );
  if (!data?.users) throw new Error('No data');
  return data.users;
}

const userTypeOptions: SelectOption[] = [
  { value: '', label: 'All types' },
  { value: UserType.WORKER, label: 'Worker' },
  { value: UserType.EMPLOYER, label: 'Employer' },
];

export default function UsersPage() {
  const [data, setData] = useState<UsersResponse['users'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [userTypeFilter, setUserTypeFilter] = useState<string>('');
  const pageSize = 20;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchUsers(page, pageSize, userTypeFilter || undefined)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load users');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, userTypeFilter]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <div className="w-40">
          <Select
            label="Type"
            options={userTypeOptions}
            value={userTypeFilter}
            onChange={(e) => {
              setUserTypeFilter(e.target.value);
              setPage(1);
            }}
            fullWidth
          />
        </div>
      </CardHeader>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : data ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.items.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{u.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{u.userType}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Page {data.page} of {data.totalPages} ({data.total} total)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!data.hasPrevious}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-gray-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!data.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-gray-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}
    </Card>
  );
}
