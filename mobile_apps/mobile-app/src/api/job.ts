import { createJobClient, createJobClientFromStore, createJobSdkFromStore } from '../utils/graphqlClient';
import { getSdk } from '../generated/graphql';

export async function jobsSearch(input: any) {
  const sdk = await createJobSdkFromStore();
  const res = await sdk.JobsSearch({ input });
  return res.jobsSearch;
}

export async function jobById(id: string) {
  const sdk = await createJobSdkFromStore();
  const res = await sdk.JobById({ id });
  return res.job;
}

export async function applyToJob(input: any) {
  const sdk = await createJobSdkFromStore();
  const res = await sdk.ApplyToJob({ input });
  return res.applyToJob;
}

export async function myApplications(page = 1, pageSize = 20) {
  const sdk = await createJobSdkFromStore();
  const res = await sdk.MyApplications({ page, pageSize });
  return res.myApplications;
}

export async function myJobs(page = 1, pageSize = 20) {
  const sdk = await createJobSdkFromStore();
  const res = await sdk.MyJobs({ page, pageSize });
  return res.myJobs;
}

export async function applicationsForJob(jobId: string, page = 1, pageSize = 20) {
  const sdk = await createJobSdkFromStore();
  const res = await sdk.ApplicationsForJob({ jobId, page, pageSize });
  return res.applicationsForJob;
}
