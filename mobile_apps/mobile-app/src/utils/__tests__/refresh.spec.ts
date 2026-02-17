import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock secureStore before importing the module under test to avoid native imports
vi.mock('../secureStore', () => ({
  getToken: vi.fn(),
  getRefreshToken: vi.fn(),
  setToken: vi.fn(),
  setRefreshToken: vi.fn(),
  clearToken: vi.fn(),
  clearUser: vi.fn(),
}));

import { makeSdkWrapper } from '../sdkWrapper';
import * as secureStore from '../secureStore';

describe('sdkWrapper refresh flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('refreshes token and retries action once (with injected refresh)', async () => {
    vi.spyOn(secureStore as any, 'getToken').mockResolvedValue('expired');
    vi.spyOn(secureStore as any, 'getRefreshToken').mockResolvedValue('refresh-token-123');
    const setTokenSpy = vi.spyOn(secureStore as any, 'setToken').mockResolvedValue(undefined);
    const setRefreshSpy = vi.spyOn(secureStore as any, 'setRefreshToken').mockResolvedValue(undefined);
    const clearTokenSpy = vi.spyOn(secureStore as any, 'clearToken').mockResolvedValue(undefined);
    const clearUserSpy = vi.spyOn(secureStore as any, 'clearUser').mockResolvedValue(undefined);

    // mock refresh function to return new tokens
    const refreshFn = vi.fn().mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh' });

    const wrapper = makeSdkWrapper(refreshFn as any);

    // action will throw when called with old token, succeed when called with new token
    const action = async (headers?: Record<string, string>) => {
      const auth = headers?.Authorization ?? '';
      if (auth === 'Bearer new-access') return { success: true };
      const err: any = new Error('Unauthorized');
      err.response = { status: 401 };
      throw err;
    };

    const result = await wrapper(action as any, 'TestOp', 'query', {});
    expect(result).toEqual({ success: true });
    expect(setTokenSpy).toHaveBeenCalledWith('new-access');
    expect(setRefreshSpy).toHaveBeenCalledWith('new-refresh');
    expect(clearTokenSpy).not.toHaveBeenCalled();
    expect(clearUserSpy).not.toHaveBeenCalled();
    expect(refreshFn).toHaveBeenCalledWith('refresh-token-123');
  });
});
