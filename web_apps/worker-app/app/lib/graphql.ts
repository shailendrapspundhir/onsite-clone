import { graphqlRequestWithRefresh } from '@onsite360/web-ui-shared';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_GRAPHQL_URL ?? 'http://localhost:3001/graphql';
const USER_URL = process.env.NEXT_PUBLIC_USER_GRAPHQL_URL ?? 'http://localhost:3002/graphql';
const JOB_URL = process.env.NEXT_PUBLIC_JOB_GRAPHQL_URL ?? 'http://localhost:3003/graphql';

export function getAuthUrl() {
  return AUTH_URL;
}

export function getUserUrl() {
  return USER_URL;
}

export function getJobUrl() {
  return JOB_URL;
}

export async function graphql<T>(
  url: string,
  query: string,
  variables: Record<string, unknown>,
  accessToken?: string | null
): Promise<T> {
  return graphqlRequestWithRefresh<T>(url, query, variables, accessToken ?? null);
}
