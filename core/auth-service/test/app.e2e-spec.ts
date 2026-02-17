import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { SchemaRegistryService } from '../src/schema/schema-registry.service';

const mockAuthService = {
  registerWithEmail: jest.fn(),
  loginWithEmail: jest.fn(),
};

const mockSchemaRegistry = {
  validate: jest.fn().mockResolvedValue({ valid: true }),
};

describe('AuthService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(SchemaRegistryService)
      .useValue(mockSchemaRegistry)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockSchemaRegistry.validate.mockResolvedValue({ valid: true });
  });

  describe('registerWithEmail', () => {
    it('should register a user with valid input', () => {
      mockAuthService.registerWithEmail.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresIn: 3600,
      });

      const input = {
        email: 'test@example.com',
        password: 'Password123!',
        userType: 'WORKER',
        firstName: 'Test',
        lastName: 'User',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation RegisterWithEmail($input: RegisterEmailInput!) {
              registerWithEmail(input: $input) {
                user {
                  id
                  email
                }
                accessToken
                refreshToken
                expiresIn
              }
            }
          `,
          variables: { input },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.registerWithEmail.user.email).toBe(input.email);
          expect(mockAuthService.registerWithEmail).toHaveBeenCalledWith(input);
        });
    });

    it('should fail with invalid email', () => {
      mockSchemaRegistry.validate.mockResolvedValueOnce({
        valid: false,
        errors: [{ message: 'Invalid email address' }],
      });

      const input = {
        email: 'invalid-email',
        password: 'Password123!',
        userType: 'WORKER',
        firstName: 'Test',
        lastName: 'User',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation RegisterWithEmail($input: RegisterEmailInput!) {
              registerWithEmail(input: $input) {
                user {
                  id
                  email
                }
                accessToken
                refreshToken
                expiresIn
              }
            }
          `,
          variables: { input },
        })
        .expect(200)
        .then(() => {
          expect(mockAuthService.registerWithEmail).not.toHaveBeenCalled();
        });
    });

    it('should fail with short password', () => {
      mockSchemaRegistry.validate.mockResolvedValueOnce({
        valid: false,
        errors: [{ message: 'Password must be at least 8 characters' }],
      });

      const input = {
        email: 'test2@example.com',
        password: '123',
        userType: 'WORKER',
        firstName: 'Test',
        lastName: 'User',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation RegisterWithEmail($input: RegisterEmailInput!) {
              registerWithEmail(input: $input) {
                user {
                  id
                  email
                }
                accessToken
                refreshToken
                expiresIn
              }
            }
          `,
          variables: { input },
        })
        .expect(200)
        .then(() => {
          expect(mockAuthService.registerWithEmail).not.toHaveBeenCalled();
        });
    });
  });

  describe('loginWithEmail', () => {
    it('should login with valid credentials', () => {
      mockAuthService.loginWithEmail.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresIn: 3600,
      });

      const input = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation LoginWithEmail($input: LoginEmailInput!) {
              loginWithEmail(input: $input) {
                user {
                  id
                  email
                }
                accessToken
                refreshToken
                expiresIn
              }
            }
          `,
          variables: { input },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.loginWithEmail.user.email).toBe(input.email);
          expect(mockAuthService.loginWithEmail).toHaveBeenCalledWith(input, undefined, expect.any(String));
        });
    });

    it('should fail with invalid email', () => {
      mockSchemaRegistry.validate.mockResolvedValueOnce({
        valid: false,
        errors: [{ message: 'Invalid email address' }],
      });

      const input = {
        email: 'invalid',
        password: 'Password123!',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation LoginWithEmail($input: LoginEmailInput!) {
              loginWithEmail(input: $input) {
                user {
                  id
                  email
                }
                accessToken
                refreshToken
                expiresIn
              }
            }
          `,
          variables: { input },
        })
        .expect(200)
        .then(() => {
          expect(mockAuthService.loginWithEmail).not.toHaveBeenCalled();
        });
    });
  });
});