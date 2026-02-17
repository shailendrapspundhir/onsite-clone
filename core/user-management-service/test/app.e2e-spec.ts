import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { WorkerService } from '../src/worker/worker.service';
import { SchemaValidateInterceptor } from '../src/schema/schema-validate.interceptor';
import { GqlAuthGuard } from '../src/guards/gql-auth.guard';
import { SchemaRegistryService } from '../src/schema/schema-registry.service';
import { BadRequestException } from '@nestjs/common';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

const mockWorkerService = {
  create: jest.fn(),
};

const mockSchemaRegistry = {
  validate: jest.fn(),
};

const mockInterceptor = {
  intercept: jest.fn().mockImplementation((context: ExecutionContext, next: CallHandler) => {
    const reflector = new Reflector();
    const schemaId = reflector.get<string>('schemaValidate', context.getHandler());
    if (schemaId === 'user.workerProfile') {
      const gql = GqlExecutionContext.create(context);
      const args = gql.getArgs();
      const input = args?.input ?? args;
      if (!input.skills || input.skills.length === 0) {
        throw new BadRequestException({
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: [{ message: 'skills is required' }],
        });
      }
      // Set userId for the test
      gql.getContext().req.userId = 'test-user-id';
    }
    return next.handle();
  }),
};

describe('UserManagementService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WorkerService)
      .useValue(mockWorkerService)
      .overrideProvider(SchemaRegistryService)
      .useValue(mockSchemaRegistry)
      .overrideProvider(SchemaValidateInterceptor)
      .useValue(mockInterceptor)
      .overrideGuard(GqlAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const gql = GqlExecutionContext.create(context);
          gql.getContext().req.userId = 'test-user-id';
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createWorkerProfile', () => {
    it('should create a worker profile with valid input', () => {
      mockWorkerService.create.mockResolvedValue({
        id: '1',
        userId: 'test-user-id',
        firstName: 'John',
        lastName: 'Doe',
        skills: ['SECURITY_GUARD'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input = {
        firstName: 'John',
        lastName: 'Doe',
        skills: ['SECURITY_GUARD'],
        experienceYears: 5,
        bio: 'Experienced security guard',
        location: 'New York',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateWorkerProfile($input: CreateWorkerProfileInput!) {
              createWorkerProfile(input: $input) {
                id
                firstName
                lastName
                skills
              }
            }
          `,
          variables: { input },
        })
        .expect(200)
        .then(() => {
          expect(mockWorkerService.create).toHaveBeenCalledWith('test-user-id', input);
        });
    });

    it('should fail with missing skills', () => {
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        skills: [],
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateWorkerProfile($input: CreateWorkerProfileInput!) {
              createWorkerProfile(input: $input) {
                id
                firstName
              }
            }
          `,
          variables: { input },
        })
        .expect(200)
        .then(() => {
          expect(mockWorkerService.create).not.toHaveBeenCalled();
        });
    });
  });
});