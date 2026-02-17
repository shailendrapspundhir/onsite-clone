import type { AuthProvider, OtpChannel } from './enums';

/**
 * JWT payload stored in access token
 */
export interface JwtPayload {
  sub: string; // userId
  email: string;
  userType: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

/**
 * Auth tokens response
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * OTP verification request
 */
export interface OtpVerifyInput {
  email?: string;
  phone?: string;
  otp: string;
  channel: OtpChannel;
}

/**
 * OTP send request
 */
export interface OtpSendInput {
  email?: string;
  phone?: string;
  channel: OtpChannel;
}

/**
 * Email/password login input
 */
export interface EmailPasswordLoginInput {
  email: string;
  password: string;
}

/**
 * OAuth callback payload
 */
export interface OAuthProfile {
  provider: AuthProvider;
  externalId: string;
  email: string;
  name?: string;
  picture?: string;
}

/**
 * Credentials entity (stored in auth DB)
 */
export interface Credential {
  id: string;
  userId: string;
  authProvider: AuthProvider;
  passwordHash?: string;
  externalId?: string;
  createdAt: Date;
  updatedAt: Date;
}
