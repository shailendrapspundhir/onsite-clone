import type { ApplicationStatus } from './enums';

/**
 * Job application entity
 */
export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  status: ApplicationStatus;
  coverMessage?: string;
  appliedAt: Date;
  updatedAt: Date;
  employerNotes?: string;
}

/**
 * Application with job and worker info
 */
export interface JobApplicationWithDetails extends JobApplication {
  jobTitle: string;
  workerName: string;
  employerId: string;
}

/**
 * Create application input
 */
export interface CreateApplicationInput {
  jobId: string;
  workerId: string;
  coverMessage?: string;
}

/**
 * Update application status input
 */
export interface UpdateApplicationStatusInput {
  status: ApplicationStatus;
  employerNotes?: string;
}
