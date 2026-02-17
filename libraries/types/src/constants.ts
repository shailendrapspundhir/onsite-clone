/**
 * OTP configuration
 */
export const OTP_LENGTH = 6;
export const OTP_TTL_SECONDS = 600; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5;

/**
 * Session configuration
 */
export const SESSION_TTL_SECONDS = 86400 * 7; // 7 days
export const REFRESH_TOKEN_TTL_SECONDS = 86400 * 30; // 30 days

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/**
 * Cache TTL (seconds)
 */
export const CACHE_TTL_USER_PROFILE = 300; // 5 min
export const CACHE_TTL_JOB_LISTING = 60; // 1 min
export const CACHE_TTL_AUTH_TOKEN = 300;
