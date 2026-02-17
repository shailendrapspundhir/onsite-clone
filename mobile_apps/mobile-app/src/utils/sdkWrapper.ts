import { getToken, getRefreshToken, setToken, setRefreshToken, clearToken, clearUser } from './secureStore';
import { SdkFunctionWrapper } from '../generated/graphql';

export type RefreshFunction = (refreshToken: string) => Promise<{ accessToken: string; refreshToken?: string } | null>;

export function makeSdkWrapper(refreshFn: RefreshFunction): SdkFunctionWrapper {
  return async (action, operationName, operationType, variables) => {
    const token = await getToken();
    const baseHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      return await action(baseHeaders);
    } catch (err: any) {
      const statusMessage = err?.response?.status || err?.response?.errors?.[0]?.message || err?.message;
      const looksLikeAuth = String(statusMessage).toLowerCase().includes('unauthorized') || String(statusMessage).toLowerCase().includes('401') || String(statusMessage).toLowerCase().includes('invalid') || String(statusMessage).toLowerCase().includes('token');
      if (!looksLikeAuth) throw err;

      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await clearToken();
        await clearUser();
        throw err;
      }

      try {
        const payload = await refreshFn(refreshToken);
        if (!payload) throw err;
        await setToken(payload.accessToken);
        if (payload.refreshToken) await setRefreshToken(payload.refreshToken);
        const retryHeaders = { Authorization: `Bearer ${payload.accessToken}` };
        return await action(retryHeaders);
      } catch (refreshErr) {
        await clearToken();
        await clearUser();
        throw refreshErr;
      }
    }
  };
}
