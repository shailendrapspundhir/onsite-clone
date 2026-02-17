import type { JobStatus, JobRole, EmploymentType } from './enums';

/**
 * Job / Opportunity entity
 */
export interface Job {
  id: string;
  employerId: string;
  title: string;
  description: string;
  role: JobRole;
  employmentType: EmploymentType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryDisplay?: boolean;
  requirements?: string[];
  benefits?: string[];
  status: JobStatus;
  publishedAt?: Date;
  closesAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Job with employer info (for listing)
 */
export interface JobWithEmployer extends Job {
  employerName: string;
  employerLocation?: string;
}

/**
 * Create job input
 */
export interface CreateJobInput {
  employerId: string;
  title: string;
  description: string;
  role: JobRole;
  employmentType: EmploymentType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryDisplay?: boolean;
  requirements?: string[];
  benefits?: string[];
  closesAt?: Date;
}

/**
 * Update job input (partial)
 */
export interface UpdateJobInput {
  title?: string;
  description?: string;
  role?: JobRole;
  employmentType?: EmploymentType;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryDisplay?: boolean;
  requirements?: string[];
  benefits?: string[];
  status?: JobStatus;
  closesAt?: Date;
}

/**
 * Job search/filter input
 */
export interface JobSearchInput {
  query?: string;
  role?: JobRole;
  employmentType?: EmploymentType;
  location?: string;
  minSalary?: number;
  skills?: JobRole[];
  page?: number;
  pageSize?: number;
}
