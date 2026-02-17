import type { User } from './user';
import type { JobRole } from './enums';

/**
 * Worker profile (extends user context)
 */
export interface WorkerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  skills: JobRole[];
  experienceYears?: number;
  bio?: string;
  location?: string;
  preferredLocations?: string[];
  availability: EmploymentPreference[];
  certifications?: string[];
  resumeUrl?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Employment preference (type + role)
 */
export interface EmploymentPreference {
  role: JobRole;
  employmentType: string;
  preferred?: boolean;
}

/**
 * Worker with user (joined)
 */
export interface WorkerProfileWithUser extends WorkerProfile {
  user: User;
}

/**
 * Create worker profile input
 */
export interface CreateWorkerProfileInput {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  skills: JobRole[];
  experienceYears?: number;
  bio?: string;
  location?: string;
  preferredLocations?: string[];
  availability: EmploymentPreference[];
  certifications?: string[];
  resumeUrl?: string;
  avatarUrl?: string;
}

/**
 * Update worker profile input (partial)
 */
export interface UpdateWorkerProfileInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  skills?: JobRole[];
  experienceYears?: number;
  bio?: string;
  location?: string;
  preferredLocations?: string[];
  availability?: EmploymentPreference[];
  certifications?: string[];
  resumeUrl?: string;
  avatarUrl?: string;
}
