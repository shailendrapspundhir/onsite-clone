jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$12$mockedhash'),
  compare: jest.fn().mockImplementation((plain: string, hash: string) => Promise.resolve(hash === '$2b$12$mockedhash' && plain === 'SecureP@ss123')),
}));

import { hashPassword, verifyPassword, hashRefreshToken, generateSecureToken } from './crypto';

describe('crypto', () => {
  describe('hashPassword / verifyPassword', () => {
    it('hashes and verifies password', async () => {
      const plain = 'SecureP@ss123';
      const hash = await hashPassword(plain);
      expect(hash).not.toBe(plain);
      expect(await verifyPassword(plain, hash)).toBe(true);
      expect(await verifyPassword('wrong', hash)).toBe(false);
    });
  });

  describe('hashRefreshToken', () => {
    it('returns deterministic hex string', () => {
      const token = 'abc123';
      const h = hashRefreshToken(token);
      expect(h).toMatch(/^[a-f0-9]{64}$/);
      expect(hashRefreshToken(token)).toBe(h);
    });
  });

  describe('generateSecureToken', () => {
    it('returns hex string of default length', () => {
      const t = generateSecureToken();
      expect(t).toMatch(/^[a-f0-9]{64}$/);
    });
    it('returns hex string of given bytes', () => {
      const t = generateSecureToken(8);
      expect(t).toMatch(/^[a-f0-9]{16}$/);
    });
  });
});
