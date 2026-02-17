/**
 * Lightweight GraphQL fetch helpers for multi-service monorepo.
 * Use these from Next.js server or client to call Auth (3001), User (3002), Job (3003).
 */

export interface GraphQLConfig {
  url: string;
  getAccessToken?: () => string | null;
}

export async function graphqlRequest<T = Record<string, unknown>>(
  config: GraphQLConfig,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = config.getAccessToken?.();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(config.url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}: ${res.statusText}`);
  const json = (await res.json()) as {
    data?: T;
    errors?: Array<{ message: string; extensions?: { code?: string } }>;
  };
  if (json.errors?.length) {
    const err = json.errors[0];
    throw new Error(err.message || 'GraphQL error');
  }
  if (json.data === undefined) throw new Error('No data in GraphQL response');
  return json.data as T;
}

// Global auth-failure handler (apps can set this via AuthProvider)
let onAuthFailure: (() => void) | null = null;

export function setOnAuthFailure(cb: (() => void) | null) {
  onAuthFailure = cb;
}

// Removed unused AUTH_STORAGE_KEY constant now that we no longer access localStorage directly in this module.

async function doFetch<T>(url: string, headers: Record<string, string>, query: string, variables?: Record<string, unknown>) {
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}: ${res.statusText}`);
  const json = (await res.json()) as {
    data?: T;
    errors?: Array<{ message: string; extensions?: { code?: string } }>;
  };
  if (json.errors?.length) {
    const err = json.errors[0];
    throw new Error(err.message || 'GraphQL error');
  }
  if (json.data === undefined) throw new Error('No data in GraphQL response');
  return json.data as T;
}

export async function graphqlRequestWithRefresh<T = Record<string, unknown>>(
  url: string,
  query: string,
  variables?: Record<string, unknown>,
  accessToken?: string | null,
  extraHeaders?: Record<string, string>,
  /** Optional callback to read persisted auth (should return parsed object or null) */
  getStoredAuth?: () => { accessToken?: string | null; refreshToken?: string | null; [k: string]: any } | null
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(extraHeaders ?? {}) };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  try {
    return await doFetch<T>(url, headers, query, variables);
  } catch (err: any) {
    const text = String(err?.message || '').toLowerCase();
    const looksLikeAuth = text.includes('401') || text.includes('unauthorized') || text.includes('invalid token') || text.includes('token');
    if (!looksLikeAuth) throw err;

    // try refresh using persisted refresh token via provided callback
    try {
      const stored = typeof getStoredAuth === 'function' ? getStoredAuth() : null;
      // If no getter provided, avoid using window/localStorage directly in package code
      if (!stored) {
        if (onAuthFailure) onAuthFailure();
        throw err;
      }
      const refreshToken = stored?.refreshToken;
      if (!refreshToken) {
        if (onAuthFailure) onAuthFailure();
        throw err;
      }

      const authUrl = `${url.replace(/\/graphql\/?$/, '')}/graphql`;
      const refreshResp = await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation Refresh($input: RefreshTokenInput!) { refreshTokens(input: $input) { accessToken refreshToken expiresIn } }`, variables: { input: { refreshToken } } }),
      });
      if (!refreshResp.ok) {
        if (onAuthFailure) onAuthFailure();
        throw err;
      }
      const refreshJson = await refreshResp.json();
      if (refreshJson.errors?.length) {
        if (onAuthFailure) onAuthFailure();
        throw err;
      }
      const payload = refreshJson.data?.refreshTokens;
      if (!payload?.accessToken) {
        if (onAuthFailure) onAuthFailure();
        throw err;
      }

      // Ask caller to persist tokens if needed via their own storage mechanism
      const retryHeaders = { ...headers, Authorization: `Bearer ${payload.accessToken}` };
      return await doFetch<T>(url, retryHeaders, query, variables);
    } catch (refreshErr) {
      if (onAuthFailure) onAuthFailure();
      throw err;
    }
  }
}

export function createAuthClient(baseUrl: string) {
  const url = `${baseUrl.replace(/\/$/, '')}/graphql`;
  return {
    url,
    query: <T>(query: string, variables?: Record<string, unknown>) =>
      graphqlRequest<T>({ url }, query, variables),
  };
}

export function createUserClient(baseUrl: string, getAccessToken: () => string | null) {
  const url = `${baseUrl.replace(/\/$/, '')}/graphql`;
  return {
    url,
    query: <T>(query: string, variables?: Record<string, unknown>) =>
      graphqlRequest<T>({ url, getAccessToken }, query, variables),
  };
}

export function createJobClient(baseUrl: string, getAccessToken: () => string | null) {
  const url = `${baseUrl.replace(/\/$/, '')}/graphql`;
  return {
    url,
    query: <T>(query: string, variables?: Record<string, unknown>) =>
      graphqlRequest<T>({ url, getAccessToken }, query, variables),
  };
}
