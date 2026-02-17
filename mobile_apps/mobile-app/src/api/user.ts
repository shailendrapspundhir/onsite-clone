import { createUserClient, createUserClientFromStore, createUserSdkFromStore } from '../utils/graphqlClient';
import { getSdk } from '../generated/graphql';

export async function fetchWorkerProfile(userId: string) {
  const sdk = await createUserSdkFromStore();
  const res = await sdk.WorkerProfile({ userId });
  return res.workerProfile;
}

export async function createWorkerProfile(input: any) {
  const sdk = await createUserSdkFromStore();
  const res = await sdk.CreateWorkerProfile({ input });
  return res.createWorkerProfile;
}

export async function fetchEmployerProfile(userId: string) {
  const sdk = await createUserSdkFromStore();
  const res = await sdk.EmployerProfile({ userId });
  return res.employerProfile;
}

export async function createEmployerProfile(input: any) {
  const sdk = await createUserSdkFromStore();
  const res = await sdk.CreateEmployerProfile({ input });
  return res.createEmployerProfile;
}
