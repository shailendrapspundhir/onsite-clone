import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { JobService } from '../src/job/job.service';
import { SchemaRegistryService } from '../src/schema/schema-registry.service';

const mockJobService = {
  create: jest.fn(),
};

const mockSchemaRegistry = {
  validate: jest.fn().mockResolvedValue({ valid: true }),
};

describe('JobService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JobService)
      .useValue(mockJobService)
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

  describe('createJob', () => {
    it('should create a job with valid input', () => {
      mockJobService.create.mockResolvedValue({
        id: '1',
        title: 'Security Guard Needed',
        description: 'We need a reliable security guard for our premises.',
        role: 'SECURITY_GUARD',
        employmentType: 'FULL_TIME',
        location: 'New York, NY',
      });

      const input = {
        title: 'Security Guard Needed',
        description: 'We need a reliable security guard for our premises.',
        role: 'SECURITY_GUARD',
        employmentType: 'FULL_TIME',
        location: 'New York, NY',
        salaryMin: 30000,
        salaryMax: 40000,
        salaryCurrency: 'USD',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateJob($input: CreateJobInput!) {
              createJob(input: $input) {
                id
                title
                description
                role
                employmentType
                location
              }
            }
          `,
          variables: { input },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createJob.title).toBe(input.title);
          expect(mockJobService.create).toHaveBeenCalledWith(expect.any(String), input);
        });
    });

    it('should fail with short title', () => {
      mockSchemaRegistry.validate.mockResolvedValueOnce({
        valid: false,
        errors: [{ message: 'Title must be at least 3 characters' }],
      });

      const input = {
        title: 'Hi',
        description: 'We need a reliable security guard for our premises.',
        role: 'SECURITY_GUARD',
        employmentType: 'FULL_TIME',
        location: 'New York, NY',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateJob($input: CreateJobInput!) {
              createJob(input: $input) {
                id
                title
              }
            }
          `,
          variables: { input },
        })
        .expect(200)
        .then(() => {
          expect(mockJobService.create).not.toHaveBeenCalled();
        });
    });
  });
});