import { authenticator } from 'otplib';
import { OTP_LENGTH, OTP_TTL_SECONDS } from '@onsite360/types';

// TOTP window: allow 1 step before/after for clock drift
authenticator.options = {
  digits: OTP_LENGTH,
  step: OTP_TTL_SECONDS,
  window: 1,
};

/**
 * Generate a TOTP secret for a user (store this securely, link to user)
 */
export function generateOtpSecret(): string {
  return authenticator.generateSecret();
}

/**
 * Generate a time-based OTP for the given secret
 */
export function generateOtp(secret: string): string {
  return authenticator.generate(secret);
}

/**
 * Verify an OTP against the user's secret
 */
export function verifyOtp(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

/**
 * Generate a 6-digit numeric OTP (for email/SMS display)
 * Uses TOTP so it's time-bound and verifiable
 */
export function getOtpForDisplay(secret: string): string {
  return authenticator.generate(secret);
}
