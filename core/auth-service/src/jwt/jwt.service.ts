import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import type { JwtPayload } from '@onsite360/types';
import { REFRESH_TOKEN_TTL_SECONDS } from '@onsite360/types';
import { generateSecureToken, hashRefreshToken, Logger as LoggerDecorator } from '@onsite360/common'; // LoggerDecorator for input/output debug logs (pretty JSON on DEBUG)

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

  @LoggerDecorator()
  signAccess(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return sign(payload, this.accessSecret, { expiresIn: this.accessExpiresIn });
  }

  @LoggerDecorator()
  verifyAccess(token: string): JwtPayload {
    return verify(token, this.accessSecret) as JwtPayload;
  }

  @LoggerDecorator()
  signRefresh(payload: { sub: string; sessionId: string }): { token: string; hash: string } {
    const token = sign(payload, this.refreshSecret, { expiresIn: REFRESH_TOKEN_TTL_SECONDS });
    const hash = hashRefreshToken(token);
    return { token, hash };
  }

  @LoggerDecorator()
  verifyRefresh(token: string): { sub: string; sessionId: string } {
    return verify(token, this.refreshSecret) as { sub: string; sessionId: string };
  }

  @LoggerDecorator()
  getAccessExpiresIn(): number {
    return this.accessExpiresIn;
  }

  @LoggerDecorator()
  generateSessionId(): string {
    return generateSecureToken(16);
  }
}
