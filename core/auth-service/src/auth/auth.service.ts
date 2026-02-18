import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User } from './entities/user.entity';
import { AuthProvider, UserType, REFRESH_TOKEN_TTL_SECONDS } from '@onsite360/types';
import { hashPassword, verifyPassword, hashRefreshToken, generateOtp, generateOtpSecret, Logger as LoggerDecorator } from '@onsite360/common'; // LoggerDecorator for input/output debug logs (pretty JSON on DEBUG)
import { JwtService } from '../jwt/jwt.service';
import { RedisService } from '../redis/redis.service';
import { CACHE_TTL_AUTH_TOKEN } from '@onsite360/types';
import type { RegisterEmailInput } from './dto/register-email.input';
import type { LoginEmailInput } from './dto/login.input';
import type { OtpSendInput, OtpVerifyInput } from './dto/otp.input';
import type { ListUsersInput } from './dto/list-users.input';
import { normalizePagination, buildPaginatedResult } from '@onsite360/common';
import { InMemoryDatabaseService } from '../in-memory-database/in-memory-database.service';

@Injectable()
export class AuthService {
  constructor(
    private db: InMemoryDatabaseService,
    private jwt: JwtService,
    private redis: RedisService,
  ) {}

  get userRepo() { return this.db.getUserRepository(); }
  get credentialRepo() { return this.db.getCredentialRepository(); }
  get sessionRepo() { return this.db.getSessionRepository(); }
  get otpSecretRepo() { return this.db.getOtpSecretRepository(); }

  @LoggerDecorator()
  async registerWithEmail(input: RegisterEmailInput): Promise<{ user: User; accessToken: string; refreshToken: string; expiresIn: number }> {
    const existing = await this.userRepo.findOne({ where: { email: input.email.toLowerCase() } });
    if (existing) throw new ConflictException('User with this email already exists');

    const user = this.userRepo.create({
      id: uuid(),
      email: input.email.toLowerCase(),
      userType: input.userType,
      isEmailVerified: false,
      isPhoneVerified: false,
    });
    await this.userRepo.save(user);

    const passwordHash = await hashPassword(input.password);
    const cred = this.credentialRepo.create({
      id: uuid(),
      userId: user.id,
      authProvider: AuthProvider.EMAIL,
      passwordHash,
    });
    await this.credentialRepo.save(cred);

    return this.createSession(user, undefined, undefined);
  }

  @LoggerDecorator()
  async loginWithEmail(input: LoginEmailInput, userAgent?: string, ip?: string): Promise<{ user: User; accessToken: string; refreshToken: string; expiresIn: number }> {
    const user = await this.userRepo.findOne({ where: { email: input.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const cred = await this.credentialRepo.findOne({ where: { userId: user.id, authProvider: AuthProvider.EMAIL } });
    if (!cred?.passwordHash) throw new UnauthorizedException('Invalid email or password');

    const valid = await verifyPassword(input.password, cred.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    return this.createSession(user, userAgent, ip);
  }

  @LoggerDecorator()
  async sendOtp(input: OtpSendInput): Promise<{ success: boolean; message: string }> {
    const key = input.channel === 'EMAIL' ? input.email?.toLowerCase() : input.phone;
    if (!key) throw new BadRequestException('Email or phone required for OTP');

    let user = await this.userRepo.findOne(
      input.channel === 'EMAIL'
        ? { where: { email: key } }
        : { where: { phone: key } },
    );
    if (!user) {
      user = this.userRepo.create({
        id: uuid(),
        email: input.channel === 'EMAIL' ? key : undefined,
        phone: input.channel === 'MOBILE' ? key : undefined,
        userType: UserType.WORKER, // default; can be overridden on verify
        isEmailVerified: false,
        isPhoneVerified: false,
      });
      await this.userRepo.save(user);
    }

    let secretEntity = await this.otpSecretRepo.findOne({ where: { userId: user.id, channel: input.channel } });
    if (!secretEntity) {
      const secret = generateOtpSecret();
      secretEntity = this.otpSecretRepo.create({
        id: uuid(),
        userId: user.id,
        channel: input.channel,
        secret,
      });
      await this.otpSecretRepo.save(secretEntity);
    }

    const otp = generateOtp(secretEntity.secret);
    // In production: send via email (nodemailer) or SMS (Twilio). For now we cache for verification.
    const cacheKey = `otp:${input.channel}:${key}`;
    await this.redis.set(cacheKey, JSON.stringify({ otp, userId: user.id }), 600);

    return { success: true, message: 'OTP sent. In development, check logs or use verifyOtp with the generated code.' };
  }

  @LoggerDecorator()
  async verifyOtpAndLogin(input: OtpVerifyInput, userAgent?: string, ip?: string): Promise<{ user: User; accessToken: string; refreshToken: string; expiresIn: number } | null> {
    const key = input.channel === 'EMAIL' ? input.email?.toLowerCase() : input.phone;
    if (!key) throw new BadRequestException('Email or phone required');

    const cacheKey = `otp:${input.channel}:${key}`;
    const raw = await this.redis.get(cacheKey);
    if (!raw) throw new UnauthorizedException('OTP expired or invalid');

    const { otp: storedOtp, userId } = JSON.parse(raw) as { otp: string; userId: string };
    if (storedOtp !== input.otp) throw new UnauthorizedException('Invalid OTP');

    await this.redis.del(cacheKey);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    if (input.channel === 'EMAIL') {
      await this.userRepo.update(user.id, { isEmailVerified: true });
      user.isEmailVerified = true;
    } else {
      await this.userRepo.update(user.id, { isPhoneVerified: true });
      user.isPhoneVerified = true;
    }

    return this.createSession(user, userAgent, ip);
  }

  @LoggerDecorator()
  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    try {
      const payload = this.jwt.verifyRefresh(refreshToken);
      const hash = hashRefreshToken(refreshToken);
      const session = await this.sessionRepo.findOne({
        where: { id: payload.sessionId, refreshTokenHash: hash },
      });
      if (!session || new Date() > session.expiresAt) throw new UnauthorizedException('Invalid or expired refresh token');

      const user = await this.userRepo.findOne({ where: { id: session.userId } });
      if (!user) throw new UnauthorizedException('Invalid or expired refresh token');

      await this.sessionRepo.remove(session);
      const result = await this.createSession(user, session.userAgent, session.ipAddress);
      return { accessToken: result.accessToken, refreshToken: result.refreshToken, expiresIn: result.expiresIn };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @LoggerDecorator()
  async logout(refreshToken: string): Promise<{ success: boolean }> {
    try {
      const payload = this.jwt.verifyRefresh(refreshToken);
      const hash = hashRefreshToken(refreshToken);
      await this.sessionRepo.delete({ id: payload.sessionId, refreshTokenHash: hash });
    } catch {
      // ignore invalid token
    }
    return { success: true };
  }

  private async createSession(
    user: User,
    userAgent?: string,
    ip?: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string; expiresIn: number }> {
    const sessionId = this.jwt.generateSessionId();
    const { token: refreshToken, hash } = this.jwt.signRefresh({ sub: user.id, sessionId });
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

    const session = this.sessionRepo.create({
      id: sessionId,
      userId: user.id,
      refreshTokenHash: hash,
      userAgent,
      ipAddress: ip,
      expiresAt,
    });
    await this.sessionRepo.save(session);

    const accessToken = this.jwt.signAccess({
      sub: user.id,
      email: user.email,
      userType: user.userType,
      sessionId,
    });
    const expiresIn = this.jwt.getAccessExpiresIn();

    const cacheKey = `auth:token:${user.id}:${sessionId}`;
    await this.redis.setTokenCache(cacheKey, accessToken, CACHE_TTL_AUTH_TOKEN);

    return { user, accessToken, refreshToken, expiresIn };
  }

  async validateAccessToken(token: string): Promise<{ userId: string; email: string; userType: string; sessionId: string } | null> {
    try {
      const payload = this.jwt.verifyAccess(token);
      return { userId: payload.sub, email: payload.email, userType: payload.userType, sessionId: payload.sessionId };
    } catch {
      return null;
    }
  }

  @LoggerDecorator()
  async listUsers(input: ListUsersInput) {
    const { page, pageSize, offset, limit } = normalizePagination({
      page: input.page,
      pageSize: input.pageSize,
    });
    const qb = this.userRepo
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC')
      .skip(offset)
      .take(limit);
    if (input.userType) {
      qb.andWhere('user.userType = :userType', { userType: input.userType });
    }
    if (input.since) {
      qb.andWhere('user.createdAt >= :since', { since: new Date(input.since) });
    }
    const [items, total] = await qb.getManyAndCount();
    return buildPaginatedResult(items as User[], total as number, page, pageSize);
  }
}
