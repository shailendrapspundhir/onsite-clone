import { Injectable } from '@nestjs/common';
import { Job } from '../job/entities/job.entity';
import { JobApplication } from '../application/entities/job-application.entity';
import { ValidationSchema } from '../schema/entities/validation-schema.entity';

@Injectable()
export class InMemoryDatabaseService {
  private jobs = new Map<string, Job>();
  private jobApplications = new Map<string, JobApplication>();
  private validationSchemas = new Map<string, ValidationSchema>();

  // Job methods
  getJobRepository() {
    const matchesWhere = (job: Job, where?: Record<string, unknown>) => {
      if (!where) return true;
      return Object.entries(where).every(([key, value]) => (job as any)[key] === value);
    };

    return {
      findOne: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        for (const job of this.jobs.values()) {
          if (matchesWhere(job, where)) return job;
        }
        return null;
      },
      find: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        return Array.from(this.jobs.values()).filter((job) => matchesWhere(job, where));
      },
      findAndCount: (options: {
        where?: Record<string, unknown>;
        order?: Record<string, 'ASC' | 'DESC'>;
        skip?: number;
        take?: number;
      } = {}): [Job[], number] => {
        let items = Array.from(this.jobs.values()).filter((job) => matchesWhere(job, options?.where));
        const total = items.length;

        const orderEntries = Object.entries(options?.order ?? {});
        if (orderEntries.length) {
          items.sort((a, b) => {
            for (const [field, direction] of orderEntries) {
              const aValue = (a as any)[field];
              const bValue = (b as any)[field];
              if (aValue == null && bValue == null) continue;
              if (aValue == null) return direction === 'ASC' ? -1 : 1;
              if (bValue == null) return direction === 'ASC' ? 1 : -1;
              const aNumber = aValue instanceof Date ? aValue.getTime() : aValue;
              const bNumber = bValue instanceof Date ? bValue.getTime() : bValue;
              if (aNumber < bNumber) return direction === 'ASC' ? -1 : 1;
              if (aNumber > bNumber) return direction === 'ASC' ? 1 : -1;
            }
            return 0;
          });
        }

        const skip = options?.skip ?? 0;
        const take = options?.take ?? items.length;
        items = items.slice(skip, skip + take);
        return [items, total];
      },
      save: (job: Job) => {
        const now = new Date();
        if (!job.id) job.id = Math.random().toString(36).substr(2, 9);
        if (!job.createdAt) job.createdAt = now;
        job.updatedAt = now;
        this.jobs.set(job.id, job);
        return job;
      },
      create: (data: Partial<Job>) => Object.assign(new Job(), data),
      delete: (id: string) => this.jobs.delete(id),
    };
  }

  // JobApplication methods
  getJobApplicationRepository() {
    const matchesWhere = (app: JobApplication, where?: Record<string, unknown>) => {
      if (!where) return true;
      return Object.entries(where).every(([key, value]) => (app as any)[key] === value);
    };

    return {
      findOne: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        for (const app of this.jobApplications.values()) {
          if (matchesWhere(app, where)) return app;
        }
        return null;
      },
      find: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        return Array.from(this.jobApplications.values()).filter((app) => matchesWhere(app, where));
      },
      findAndCount: (options: {
        where?: Record<string, unknown>;
        order?: Record<string, 'ASC' | 'DESC'>;
        skip?: number;
        take?: number;
      } = {}): [JobApplication[], number] => {
        let items = Array.from(this.jobApplications.values()).filter((app) => matchesWhere(app, options.where));
        const total = items.length;

        const orderEntries = Object.entries(options.order ?? {});
        if (orderEntries.length) {
          items.sort((a, b) => {
            for (const [field, direction] of orderEntries) {
              const aValue = (a as any)[field];
              const bValue = (b as any)[field];
              if (aValue == null && bValue == null) continue;
              if (aValue == null) return direction === 'ASC' ? -1 : 1;
              if (bValue == null) return direction === 'ASC' ? 1 : -1;
              const aComparable = aValue instanceof Date ? aValue.getTime() : aValue;
              const bComparable = bValue instanceof Date ? bValue.getTime() : bValue;
              if (aComparable < bComparable) return direction === 'ASC' ? -1 : 1;
              if (aComparable > bComparable) return direction === 'ASC' ? 1 : -1;
            }
            return 0;
          });
        }

        const skip = options.skip ?? 0;
        const take = options.take ?? items.length;
        items = items.slice(skip, skip + take);
        return [items, total];
      },
      save: (app: JobApplication) => {
        const now = new Date();
        if (!app.id) app.id = Math.random().toString(36).substr(2, 9);
        if (!app.appliedAt) app.appliedAt = now;
        app.updatedAt = now;
        this.jobApplications.set(app.id, app);
        return app;
      },
      create: (data: Partial<JobApplication>) => Object.assign(new JobApplication(), data),
      delete: (id: string) => this.jobApplications.delete(id),
    };
  }

  // ValidationSchema methods
  getValidationSchemaRepository() {
    return {
      find: () => Array.from(this.validationSchemas.values()),
      findOne: (options: any) => {
        if (options.where?.id) {
          return this.validationSchemas.get(options.where.id) || null;
        }
        return null;
      },
      save: (schema: ValidationSchema) => {
        const now = new Date();
        if (!schema.id) schema.id = Math.random().toString(36).substr(2, 9);
        if (!schema.createdAt) schema.createdAt = now;
        schema.updatedAt = now;
        this.validationSchemas.set(schema.id, schema);
        return schema;
      },
      create: (data: Partial<ValidationSchema>) => Object.assign(new ValidationSchema(), data),
      delete: (id: string) => this.validationSchemas.delete(id),
    };
  }
}