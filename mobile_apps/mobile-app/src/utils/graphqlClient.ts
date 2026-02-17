import { GraphQLClient } from 'graphql-request';
import { Platform } from 'react-native';
import { getToken, getRefreshToken, setToken, setRefreshToken, clearToken, clearUser } from './secureStore';
import { getSdk, SdkFunctionWrapper } from '../generated/graphql';
import { makeSdkWrapper } from './sdkWrapper';

// On Android emulator localhost of host machine is 10.0.2.2
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const AUTH_URL = `http://${HOST}:3001/graphql`;
const USER_URL = `http://${HOST}:3002/graphql`;
const JOB_URL = `http://${HOST}:3003/graphql`;

export function createAuthClient(token?: string) {
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return new GraphQLClient(AUTH_URL, { headers });
}

export function createUserClient(token?: string) {
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return new GraphQLClient(USER_URL, { headers });
}

export function createJobClient(token?: string) {
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return new GraphQLClient(JOB_URL, { headers });
}

export async function createAuthClientFromStore() {
  const token = await getToken();
  return createAuthClient(token ?? undefined);
}

export async function createUserClientFromStore() {
  const token = await getToken();
  return createUserClient(token ?? undefined);
}

export async function createJobClientFromStore() {
  const token = await getToken();
  return createJobClient(token ?? undefined);
}

// runtime refresh function using auth client
const runtimeRefresh = async (refreshToken: string) => {
  try {
    const authClient = createAuthClient();
    const refreshMutation = `mutation RefreshTokens($input: RefreshTokenInput!) { refreshTokens(input: $input) { accessToken refreshToken expiresIn } }`;
    const res: any = await authClient.request(refreshMutation, { input: { refreshToken } });
    const payload = res?.refreshTokens;
    if (!payload) return null;
    return { accessToken: payload.accessToken, refreshToken: payload.refreshToken };
  } catch {
    return null;
  }
};

export const sdkWrapper: SdkFunctionWrapper = makeSdkWrapper(runtimeRefresh);

// Helpers: create wrapped SDK instances for each service from the stored token
export async function createAuthSdkFromStore() {
  const client = await createAuthClientFromStore();
  return getSdk(client as any, sdkWrapper);
}

export async function createUserSdkFromStore() {
  const client = await createUserClientFromStore();
  return getSdk(client as any, sdkWrapper);
}

export async function createJobSdkFromStore() {
  const client = await createJobClientFromStore();
  return getSdk(client as any, sdkWrapper);
}
