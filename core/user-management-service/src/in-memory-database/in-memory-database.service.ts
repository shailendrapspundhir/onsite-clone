import { Injectable } from '@nestjs/common';
import { WorkerProfile } from '../worker/entities/worker-profile.entity';
import { EmployerProfile } from '../employer/entities/employer-profile.entity';
import { ValidationSchema } from '../schema/entities/validation-schema.entity';

@Injectable()
export class InMemoryDatabaseService {
  private workerProfiles = new Map<string, WorkerProfile>();
  private employerProfiles = new Map<string, EmployerProfile>();
  private validationSchemas = new Map<string, ValidationSchema>();

  // WorkerProfile methods
  getWorkerProfileRepository() {
    const matchesWhere = (profile: WorkerProfile, where?: Record<string, unknown>) => {
      if (!where) return true;
      return Object.entries(where).every(([key, value]) => (profile as any)[key] === value);
    };

    return {
      findOne: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        for (const profile of this.workerProfiles.values()) {
          if (matchesWhere(profile, where)) return profile;
        }
        return null;
      },
      find: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        return Array.from(this.workerProfiles.values()).filter((profile) => matchesWhere(profile, where));
      },
      save: (profile: WorkerProfile) => {
        const now = new Date();
        if (!profile.id) profile.id = Math.random().toString(36).substr(2, 9);
        if (!profile.createdAt) profile.createdAt = now;
        profile.updatedAt = now;
        this.workerProfiles.set(profile.id, profile);
        return profile;
      },
      create: (data: Partial<WorkerProfile>) => Object.assign(new WorkerProfile(), data),
      delete: (id: string) => this.workerProfiles.delete(id),
    };
  }

  // EmployerProfile methods
  getEmployerProfileRepository() {
    const matchesWhere = (profile: EmployerProfile, where?: Record<string, unknown>) => {
      if (!where) return true;
      return Object.entries(where).every(([key, value]) => (profile as any)[key] === value);
    };

    return {
      findOne: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        for (const profile of this.employerProfiles.values()) {
          if (matchesWhere(profile, where)) return profile;
        }
        return null;
      },
      find: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        return Array.from(this.employerProfiles.values()).filter((profile) => matchesWhere(profile, where));
      },
      save: (profile: EmployerProfile) => {
        const now = new Date();
        if (!profile.id) profile.id = Math.random().toString(36).substr(2, 9);
        if (!profile.createdAt) profile.createdAt = now;
        profile.updatedAt = now;
        this.employerProfiles.set(profile.id, profile);
        return profile;
      },
      create: (data: Partial<EmployerProfile>) => Object.assign(new EmployerProfile(), data),
      delete: (id: string) => this.employerProfiles.delete(id),
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