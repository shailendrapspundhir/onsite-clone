/**
 * User account type
 */
export enum UserType {
  WORKER = 'WORKER',
  EMPLOYER = 'EMPLOYER',
}

/**
 * OAuth provider
 */
export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  APPLE = 'APPLE',
}

/**
 * OTP channel (email or mobile)
 */
export enum OtpChannel {
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
}

/**
 * Job status
 */
export enum JobStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

/**
 * Application status
 */
export enum ApplicationStatus {
  PENDING = 'PENDING',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED',
  WITHDRAWN = 'WITHDRAWN',
}

/**
 * Job role / category
 */
export enum JobRole {
  SECURITY_GUARD = 'SECURITY_GUARD',
  COOK = 'COOK',
  CLEANER = 'CLEANER',
  DRIVER = 'DRIVER',
  RECEPTIONIST = 'RECEPTIONIST',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER',
}

/**
 * Employment type
 */
export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  TEMPORARY = 'TEMPORARY',
}
