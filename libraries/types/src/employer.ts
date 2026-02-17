import type { User } from './user';
import type { JobRole } from './enums';

/**
 * Employer profile
 */
export interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  industry?: string;
  description?: string;
  website?: string;
  location?: string;
  contactEmail: string;
  contactPhone?: string;
  logoUrl?: string;
  desiredRoles: JobRole[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Employer with user
 */
export interface EmployerProfileWithUser extends EmployerProfile {
  user: User;
}

/**
 * Create employer profile input
 */
export interface CreateEmployerProfileInput {
  userId: string;
  companyName: string;
  industry?: string;
  description?: string;
  website?: string;
  location?: string;
  contactEmail: string;
  contactPhone?: string;
  logoUrl?: string;
  desiredRoles: JobRole[];
}

/**
 * Update employer profile input (partial)
 */
export interface UpdateEmployerProfileInput {
  companyName?: string;
  industry?: string;
  description?: string;
  website?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  desiredRoles?: JobRole[];
}
