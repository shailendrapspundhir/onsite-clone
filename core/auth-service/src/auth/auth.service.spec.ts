import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Credential } from './entities/credential.entity';
import { Session } from './entities/session.entity';
import { OtpSecret } from './entities/otp-secret.entity';
import { JwtService } from '../jwt/jwt.service';
import { RedisService } from '../redis/redis.service';
describe('AuthService', () => {
  let service: AuthService;
  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
  const mockCredentialRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockSessionRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };
  const mockOtpSecretRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockJwt = {
    signAccess: jest.fn().mockReturnValue('access'),
    signRefresh: jest.fn().mockReturnValue({ token: 'refresh', hash: 'hash' }),
    getAccessExpiresIn: jest.fn().mockReturnValue(900),
    verifyRefresh: jest.fn(),
    generateSessionId: jest.fn().mockReturnValue('session-id'),
  };
  const mockRedis = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Credential), useValue: mockCredentialRepo },
        { provide: getRepositoryToken(Session), useValue: mockSessionRepo },
        { provide: getRepositoryToken(OtpSecret), useValue: mockOtpSecretRepo },
        { provide: JwtService, useValue: mockJwt },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loginWithEmail', () => {
    it('throws when user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(
        service.loginWithEmail({ email: 'nope@test.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
