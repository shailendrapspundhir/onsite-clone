import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import type { JwtPayload } from '@onsite360/types';
import { REFRESH_TOKEN_TTL_SECONDS } from '@onsite360/types';
import { generateSecureToken, hashRefreshToken } from '@onsite360/common';

@Injectable()
export class JwtService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: number;

  constructor(private config: ConfigService) {
    this.accessSecret = this.config.get<string>('JWT_ACCESS_SECRET', 'change-me-in-production');
    this.refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET', 'change-me-in-production-refresh');
    this.accessExpiresIn = parseInt(this.config.get<string>('JWT_ACCESS_EXPIRES', '900'), 10); // 15 min default
  }

  signAccess(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return sign(payload, this.accessSecret, { expiresIn: this.accessExpiresIn });
  }

  verifyAccess(token: string): JwtPayload {
    return verify(token, this.accessSecret) as JwtPayload;
  }

  signRefresh(payload: { sub: string; sessionId: string }): { token: string; hash: string } {
    const token = sign(payload, this.refreshSecret, { expiresIn: REFRESH_TOKEN_TTL_SECONDS });
    const hash = hashRefreshToken(token);
    return { token, hash };
  }

  verifyRefresh(token: string): { sub: string; sessionId: string } {
    return verify(token, this.refreshSecret) as { sub: string; sessionId: string };
  }

  getAccessExpiresIn(): number {
    return this.accessExpiresIn;
  }

  generateSessionId(): string {
    return generateSecureToken(16);
  }
}
