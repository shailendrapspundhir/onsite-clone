/**
 * Sanitize string input to prevent XSS/injection
 * Strip or escape dangerous characters
 */
export function sanitizeString(input: string | undefined | null, maxLength: number = 10000): string {
  if (input == null) return '';
  let s = String(input)
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // strip < >
    .replace(/\0/g, '')   // strip null bytes
    .trim();
  return s;
}

/**
 * Sanitize for SQL-like contexts (use parameterized queries in DB; this is extra)
 */
export function sanitizeForLog(input: string | undefined | null): string {
  if (input == null) return '';
  return String(input)
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .slice(0, 500);
}
