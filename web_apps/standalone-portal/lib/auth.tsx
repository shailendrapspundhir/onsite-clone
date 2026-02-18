'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthPayload, LoginInput, RegisterInput, graphqlRequest } from './graphql';

// Auth context for standalone app - inlined from shared (no lib deps)
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const saveAuth = (payload: AuthPayload) => {
    setUser(payload.user);
    setAccessToken(payload.accessToken);
    localStorage.setItem('accessToken', payload.accessToken);
    localStorage.setItem('refreshToken', payload.refreshToken);
    localStorage.setItem('user', JSON.stringify(payload.user));
  };

  const login = async (input: LoginInput) => {
    const data = await graphqlRequest<{ loginWithEmail: AuthPayload }>(
      `
        mutation Login($input: LoginEmailInput!) {
          loginWithEmail(input: $input) {
            accessToken
            refreshToken
            expiresIn
            user {
              id
              email
              userType
            }
          }
        }
      `,
      { input }
    );
    saveAuth(data.loginWithEmail);
  };

  const register = async (input: RegisterInput) => {
    const data = await graphqlRequest<{ registerWithEmail: AuthPayload }>(
      `
        mutation Register($input: RegisterEmailInput!) {
          registerWithEmail(input: $input) {
            accessToken
            refreshToken
            expiresIn
            user {
              id
              email
              userType
            }
          }
        }
      `,
      { input }
    );
    saveAuth(data.registerWithEmail);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // Optionally call logout mutation
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Re-export types from graphql.ts for convenience (used by pages)
export type { User, LoginInput, RegisterInput } from './graphql';
export type { AuthPayload } from './graphql';

// Additional helpers for profiles/jobs - standalone, no lib deps
// Handles create/update for profiles (since new users start without profile)

export async function getWorkerProfile(userId: string, token: string) {
  const data = await graphqlRequest<{ workerProfile: any }>(
    `query GetWorkerProfile($userId: String!) { workerProfile(userId: $userId) { id userId firstName lastName avatarUrl dateOfBirth skills location bio experienceYears } }`,
    { userId },
    'user',
    token
  );
  return data.workerProfile;
}

export async function createWorkerProfile(input: any, token: string) {
  const data = await graphqlRequest<{ createWorkerProfile: any }>(
    `mutation CreateWorker($input: CreateWorkerProfileInput!) { createWorkerProfile(input: $input) { id userId firstName lastName avatarUrl } }`,
    { input },
    'user',
    token
  );
  return data.createWorkerProfile;
}

export async function updateWorkerProfile(input: any, token: string) {
  const data = await graphqlRequest<{ updateWorkerProfile: any }>(
    `mutation UpdateWorker($input: UpdateWorkerProfileInput!) { updateWorkerProfile(input: $input) { id userId firstName lastName } }`,
    { input },
    'user',
    token
  );
  return data.updateWorkerProfile;
}

// Unified save for worker: explicitly check existence to avoid 'already exists' error (from create when profile present)
// Fixes worker profile page error; uses get + branch (update/create) for race-safety
export async function saveWorkerProfile(profileInput: any, token: string, userId: string) {
  try {
    // Check if profile exists
    const existing = await getWorkerProfile(userId, token);
    if (existing) {
      // Update if exists
      return await updateWorkerProfile(profileInput, token);
    }
  } catch (err) {
    // No profile (NotFound) - proceed to create
    logger?.debug('No existing worker profile, will create', { userId }); // uses portal logger if avail
  }

  // Create if not exists
  const createInput = {
    firstName: profileInput.firstName || 'Unknown',
    lastName: profileInput.lastName || 'User',
    // required fields from schema to avoid validation errors
    skills: profileInput.skills || ['OTHER'],
    availability: [{ role: 'OTHER', employmentType: 'FULL_TIME' }], // minimal required
    ...profileInput,
  };
  return await createWorkerProfile(createInput, token);
}

export async function getEmployerProfile(userId: string, token: string) {
  const data = await graphqlRequest<{ employerProfile: any }>(
    `query GetEmployerProfile($userId: String!) { employerProfile(userId: $userId) { id userId companyName logoUrl industry location } }`,
    { userId },
    'user',
    token
  );
  return data.employerProfile;
}

export async function createEmployerProfile(input: any, token: string) {
  const data = await graphqlRequest<{ createEmployerProfile: any }>(
    `mutation CreateEmployer($input: CreateEmployerProfileInput!) { createEmployerProfile(input: $input) { id userId companyName } }`,
    { input },
    'user',
    token
  );
  return data.createEmployerProfile;
}

export async function updateEmployerProfile(input: any, token: string) {
  const data = await graphqlRequest<{ updateEmployerProfile: any }>(
    `mutation UpdateEmployer($input: UpdateEmployerProfileInput!) { updateEmployerProfile(input: $input) { id userId companyName } }`,
    { input },
    'user',
    token
  );
  return data.updateEmployerProfile;
}

// Unified save for employer: explicitly check existence to prevent 'already exists' errors (from create when profile present)
// Mirrors worker fix; uses get + branch for reliability
export async function saveEmployerProfile(profileInput: any, token: string, userId: string) {
  try {
    // Check if profile exists
    const existing = await getEmployerProfile(userId, token);
    if (existing) {
      // Update if exists
      return await updateEmployerProfile(profileInput, token);
    }
  } catch (err) {
    // No profile (NotFound) - proceed to create
    logger?.debug('No existing employer profile, will create', { userId }); // uses portal logger if avail
  }

  // Create if not exists with required fields
  const createInput = {
    companyName: profileInput.companyName || 'My Company',
    contactEmail: profileInput.contactEmail || 'contact@example.com', // required
    desiredRoles: profileInput.desiredRoles || ['OTHER'], // required
    ...profileInput,
  };
  return await createEmployerProfile(createInput, token);
}

// Job helpers
export async function searchJobs(input: any, token?: string) {
  const data = await graphqlRequest<{ jobsSearch: any }>(
    `query SearchJobs($input: JobSearchInput!) { jobsSearch(input: $input) { items { id title role location description employerId } total page } }`,
    { input },
    'job',
    token
  );
  return data.jobsSearch;
}

export async function getJob(id: string, token?: string) {
  const data = await graphqlRequest<{ job: any }>(
    `query GetJob($id: String!) { job(id: $id) { id title role location description employmentType status } }`,
    { id },
    'job',
    token
  );
  return data.job;
}

export async function myJobs(token: string) {
  const data = await graphqlRequest<{ myJobs: any }>(
    `query MyJobs { myJobs { items { id title role location status } } }`,
    {},
    'job',
    token
  );
  return data.myJobs;
}

export async function createJob(input: any, token: string) {
  const data = await graphqlRequest<{ createJob: any }>(
    `mutation CreateJob($input: CreateJobInput!) { createJob(input: $input) { id title status } }`,
    { input },
    'job',
    token
  );
  return data.createJob;
}

export async function myApplications(token: string) {
  const data = await graphqlRequest<{ myApplications: any }>(
    `query MyApps { myApplications { items { id jobId status appliedAt } } }`,
    {},
    'job',
    token
  );
  return data.myApplications;
}

// New: for applications and publish/withdraw (to fix profile/job errors and enable full flows)
export async function applyToJob(input: { jobId: string; coverMessage?: string }, token: string) {
  const data = await graphqlRequest<{ applyToJob: any }>(
    `mutation Apply($input: CreateApplicationInput!) { applyToJob(input: $input) { id jobId status appliedAt } }`,
    { input },
    'job',
    token
  );
  return data.applyToJob;
}

export async function applicationsForJob(jobId: string, token: string) {
  const data = await graphqlRequest<{ applicationsForJob: any }>(
    `query AppsForJob($jobId: String!) { applicationsForJob(jobId: $jobId) { items { id workerId status appliedAt coverMessage } } }`,
    { jobId },
    'job',
    token
  );
  return data.applicationsForJob;
}

export async function withdrawApplication(applicationId: string, token: string) {
  const data = await graphqlRequest<{ withdrawApplication: any }>(
    `mutation Withdraw($applicationId: String!) { withdrawApplication(applicationId: $applicationId) { id status } }`,
    { applicationId },
    'job',
    token
  );
  return data.withdrawApplication;
}

export async function publishJob(id: string, token: string) {
  const data = await graphqlRequest<{ publishJob: any }>(
    `mutation Publish($id: String!) { publishJob(id: $id) { id status publishedAt } }`,
    { id },
    'job',
    token
  );
  return data.publishJob;
}
