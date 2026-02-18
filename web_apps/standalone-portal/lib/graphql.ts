// Standalone GraphQL client - no dependencies on monorepo libraries/schemas
// Integrated with logger for DEBUG visibility into API calls, errors (e.g., profile updates)

import { logger } from './logger';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_GRAPHQL_URL || 'http://localhost:3001/graphql';
const USER_URL = process.env.NEXT_PUBLIC_USER_GRAPHQL_URL || 'http://localhost:3002/graphql';
const JOB_URL = process.env.NEXT_PUBLIC_JOB_GRAPHQL_URL || 'http://localhost:3003/graphql';

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlRequest<T = any>(
  query: string,
  variables?: any,
  endpoint: 'auth' | 'user' | 'job' = 'auth',
  token?: string
): Promise<T> {
  const url = endpoint === 'auth' ? AUTH_URL : endpoint === 'user' ? USER_URL : JOB_URL;

  // Log API calls at DEBUG for troubleshooting (e.g., profile save errors, mutations)
  logger.debug(`GraphQL ${endpoint.toUpperCase()} request`, { 
    operation: query.split('(')[0].trim().replace(/mutation|query| /g, ''), 
    hasToken: !!token 
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // For admin features if needed, but not used here
  // if (adminSecret) headers['X-Admin-Secret'] = adminSecret;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    logger.error(`GraphQL HTTP error`, { url: url.replace(/:\d+/, ':***'), status: response.statusText });
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    logger.error(`GraphQL error`, { errors: result.errors, variables: JSON.stringify(variables).substring(0, 200) });
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  logger.debug(`GraphQL success`, { endpoint });
  return result.data as T;
}

// Type definitions (minimal, no @onsite360/types)
export interface User {
  id: string;
  email: string;
  userType: 'WORKER' | 'EMPLOYER';
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  userType: 'WORKER' | 'EMPLOYER';
  firstName?: string;
  lastName?: string;
}
