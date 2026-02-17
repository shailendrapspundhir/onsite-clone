import create from 'zustand';
import { createAuthClient } from '../utils/graphqlClient';
import { setToken, getUser, setUser, clearToken, clearUser, setRefreshToken, clearRefreshToken } from '../utils/secureStore';
import { getSdk } from '../generated/graphql';

type User = { id: string; email: string; userType: 'WORKER' | 'EMPLOYER' } | null;

type AuthState = {
  user: User;
  accessToken?: string | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { email: string; password: string; userType: 'WORKER' | 'EMPLOYER' }) => Promise<void>;
  logout: () => void;
  initialize?: () => Promise<void>;
  setUser: (u: User) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  // try to rehydrate user from storage
  // Note: rehydration occurs after initialization; caller can await getUser() separately if needed
  async initialize() {
    const stored = await getUser();
    if (stored) set({ user: stored });
  },
  setUser: (u) => set({ user: u }),
  login: async ({ email, password }) => {
    const client = createAuthClient();
    const sdk = getSdk(client as any);
    const res = await sdk.LoginWithEmail({ input: { email, password } });
    const payload = res?.loginWithEmail;
    if (!payload) throw new Error('Login failed');
    await setToken(payload.accessToken);
    if (payload.refreshToken) await setRefreshToken(payload.refreshToken);
    await setUser(payload.user);
    set({ accessToken: payload.accessToken, user: payload.user });
  },
  register: async ({ email, password, userType }) => {
    const client = createAuthClient();
    const sdk = getSdk(client as any);
    const res = await sdk.RegisterWithEmail({ input: { email, password, userType, firstName: null, lastName: null } });
    const payload = res?.registerWithEmail;
    if (!payload) throw new Error('Register failed');
    await setToken(payload.accessToken);
    if (payload.refreshToken) await setRefreshToken(payload.refreshToken);
    await setUser(payload.user);
    set({ accessToken: payload.accessToken, user: payload.user });
  },
  logout: () => {
    clearToken();
    clearRefreshToken();
    clearUser();
    set({ user: null, accessToken: null });
  }
}));

