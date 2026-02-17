'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { setOnAuthFailure, graphqlRequestWithRefresh } from '../graphql/client';

export interface AuthUser {
  id: string;
  email: string;
  userType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithMobile: (mobile: string, otp: string, userType: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    userType: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  clearAuth: () => void;
}

const AUTH_STORAGE_KEY = 'onsite360_auth';

function getStoredAuth(): Partial<AuthState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      user?: AuthUser;
      accessToken?: string;
      refreshToken?: string;
    };
    return {
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
    };
  } catch {
    return null;
  }
}

function setStoredAuth(state: Partial<AuthState> | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!state?.accessToken) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      })
    );
  } catch {
    // ignore
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
  authGraphqlUrl: string;
}

export function AuthProvider({ children, authGraphqlUrl }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const persist = useCallback((partial: Partial<AuthState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      setStoredAuth(next);
      return {
        ...next,
        isAuthenticated: !!next.accessToken && !!next.user,
      };
    });
  }, []);

  const clearAuth = useCallback(() => {
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
    setStoredAuth(null);
  }, []);

  const graphql = useCallback(
    async (query: string, variables?: Record<string, unknown>) =>
      graphqlRequestWithRefresh(authGraphqlUrl, query, variables, state.accessToken ?? null, undefined, getStoredAuth),
    [authGraphqlUrl, state.accessToken]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await graphql(
        `mutation Login($input: LoginEmailInput!) {
          loginWithEmail(input: $input) {
            user { id email userType createdAt updatedAt }
            accessToken refreshToken expiresIn
          }
        }`,
        { input: { email, password } }
      );
      const payload = (data as { loginWithEmail: AuthPayload }).loginWithEmail;
      persist({
        user: payload.user as AuthUser,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      });
    },
    [graphql, persist]
  );

  const loginWithMobile = useCallback(
    async (mobile: string, otp: string, userType: string) => {
      const data = await graphql(
        `mutation LoginMobile($input: LoginMobileInput!) {
          loginWithMobile(input: $input) {
            user { id email userType createdAt updatedAt }
            accessToken refreshToken expiresIn
          }
        }`,
        { input: { mobile, otp, userType } }
      );
      const payload = (data as { loginWithMobile: AuthPayload }).loginWithMobile;
      persist({
        user: payload.user as AuthUser,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      });
    },
    [graphql, persist]
  );

  type AuthPayload = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      userType: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const data = await graphql(
        `mutation Register($input: RegisterEmailInput!) {
          registerWithEmail(input: $input) {
            user { id email userType createdAt updatedAt }
            accessToken refreshToken expiresIn
          }
        }`,
        { input }
      );
      const payload = (data as { registerWithEmail: AuthPayload }).registerWithEmail;
      persist({
        user: payload.user as AuthUser,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      });
    },
    [graphql, persist]
  );

  const refreshTokens = useCallback(async () => {
    const stored = getStoredAuth();
    if (!stored?.refreshToken) {
      clearAuth();
      return;
    }
    try {
      const data = await graphql(
        `mutation Refresh($input: RefreshTokenInput!) {
          refreshTokens(input: $input) {
            accessToken refreshToken expiresIn
          }
        }`,
        { input: { refreshToken: stored.refreshToken } }
      );
      const payload = (data as { refreshTokens: { accessToken: string; refreshToken: string } }).refreshTokens;
      persist({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        user: stored.user ?? null,
      });
    } catch {
      clearAuth();
    }
  }, [graphql, persist, clearAuth]);

  const logout = useCallback(async () => {
    const stored = getStoredAuth();
    if (stored?.refreshToken) {
      try {
        await graphql(
          `mutation Logout($input: RefreshTokenInput!) {
            logout(input: $input) { success }
          }`,
          { input: { refreshToken: stored.refreshToken } }
        );
      } catch {
        // ignore
      }
    }
    clearAuth();
  }, [graphql, clearAuth]);

  const setTokens = useCallback(
    (accessToken: string, refreshToken: string, user: AuthUser) => {
      persist({ user, accessToken, refreshToken });
    },
    [persist]
  );

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.accessToken && stored?.user) {
      setState((prev) => ({
        ...prev,
        ...stored,
        isAuthenticated: true,
        isLoading: false,
      }));
      return;
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  // register global auth-failure handler so shared graphql client can notify us
  useEffect(() => {
    setOnAuthFailure(() => {
      clearAuth();
      try {
        if (typeof window !== 'undefined') {
          // redirect to login page of the host app
          window.location.replace('/login');
        }
      } catch {}
    });
    return () => setOnAuthFailure(null);
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      loginWithMobile,
      register,
      logout,
      refreshTokens,
      setTokens,
      clearAuth,
    }),
    [state, login, loginWithMobile, register, logout, refreshTokens, setTokens, clearAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
