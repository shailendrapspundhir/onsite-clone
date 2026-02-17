import type { UserType } from './enums';

/**
 * Base user entity (shared across services)
 */
export interface User {
  id: string;
  email: string;
  phone?: string;
  userType: UserType;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User creation input
 */
export interface CreateUserInput {
  email: string;
  phone?: string;
  userType: UserType;
  passwordHash?: string;
  authProvider: string;
  externalId?: string;
}

/**
 * User update input (partial)
 */
export interface UpdateUserInput {
  email?: string;
  phone?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}
