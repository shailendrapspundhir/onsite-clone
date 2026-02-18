import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { Session } from '../auth/entities/session.entity';
import { Credential } from '../auth/entities/credential.entity';
import { OtpSecret } from '../auth/entities/otp-secret.entity';
import { ValidationSchema } from '../schema/entities/validation-schema.entity';

@Injectable()
export class InMemoryDatabaseService {
  private users = new Map<string, User>();
  private sessions = new Map<string, Session>();
  private credentials = new Map<string, Credential>();
  private otpSecrets = new Map<string, OtpSecret>();
  private validationSchemas = new Map<string, ValidationSchema>();

  // User methods
  getUserRepository() {
    const matchesWhere = (user: User, where?: Record<string, unknown>) => {
      if (!where) return true;
      return Object.entries(where).every(([key, value]) => (user as any)[key] === value);
    };

    return {
      findOne: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        for (const user of this.users.values()) {
          if (matchesWhere(user, where)) return user;
        }
        return null;
      },
      find: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        return Array.from(this.users.values()).filter((user) => matchesWhere(user, where));
      },
      save: (user: User) => {
        const now = new Date();
        if (!user.id) user.id = Math.random().toString(36).substr(2, 9);
        if (!user.createdAt) user.createdAt = now;
        user.updatedAt = now;
        this.users.set(user.id, user);
        return user;
      },
      create: (data: Partial<User>) => Object.assign(new User(), data),
      update: (id: string, data: Partial<User>) => {
        const user = this.users.get(id);
        if (user) {
          Object.assign(user, data);
          user.updatedAt = new Date();
          this.users.set(id, user);
        }
        return { affected: user ? 1 : 0 };
      },
      delete: (criteria: any) => {
        if (typeof criteria === 'string') {
          return this.users.delete(criteria);
        }
        if (criteria.id) {
          return this.users.delete(criteria.id);
        }
        return false;
      },
      createQueryBuilder: (_alias: string) => {
        let orderByField: string | null = null;
        let orderDirection: 'ASC' | 'DESC' = 'ASC';
        let skipNum = 0;
        let takeNum = Infinity;
        let whereConditions: any[] = [];

        const qb = {
          orderBy: (field: string, direction: 'ASC' | 'DESC') => {
            orderByField = field;
            orderDirection = direction;
            return qb;
          },
          skip: (num: number) => {
            skipNum = num;
            return qb;
          },
          take: (num: number) => {
            takeNum = num;
            return qb;
          },
          andWhere: (condition: string, params: any) => {
            whereConditions.push({ condition, params });
            return qb;
          },
          getManyAndCount: () => {
            let users = Array.from(this.users.values());

            // Apply where conditions
            for (const { condition, params } of whereConditions) {
              if (condition.includes('user.userType = :userType')) {
                users = users.filter(u => u.userType === params.userType);
              }
              if (condition.includes('user.createdAt >= :since')) {
                users = users.filter(u => u.createdAt && u.createdAt >= params.since);
              }
            }

            // Apply ordering
            if (orderByField === 'user.createdAt') {
              users.sort((a, b) => {
                const aVal = a.createdAt?.getTime() || 0;
                const bVal = b.createdAt?.getTime() || 0;
                return orderDirection === 'DESC' ? bVal - aVal : aVal - bVal;
              });
            }

            // Apply pagination
            const total = users.length;
            const items = users.slice(skipNum, skipNum + takeNum);

            return [items, total];
          },
        };
        return qb;
      },
    };
  }

  // Session methods
  getSessionRepository() {
    const matchesWhere = (session: Session, where?: Record<string, unknown>) => {
      if (!where) return true;
      return Object.entries(where).every(([key, value]) => (session as any)[key] === value);
    };

    return {
      findOne: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        for (const session of this.sessions.values()) {
          if (matchesWhere(session, where)) return session;
        }
        return null;
      },
      save: (session: Session) => {
        if (!session.id) session.id = Math.random().toString(36).substr(2, 9);
        if (!session.createdAt) session.createdAt = new Date();
        this.sessions.set(session.id, session);
        return session;
      },
      create: (data: Partial<Session>) => Object.assign(new Session(), data),
      delete: (criteria: any) => {
        if (typeof criteria === 'string') {
          return this.sessions.delete(criteria);
        }
        if (criteria?.id) {
          const existing = this.sessions.get(criteria.id);
          if (existing && matchesWhere(existing, criteria)) {
            return this.sessions.delete(criteria.id);
          }
        }
        return false;
      },
      remove: (session: Session) => {
        return this.sessions.delete(session.id);
      },
    };
  }

  // Credential methods
  getCredentialRepository() {
    const matchesWhere = (credential: Credential, where?: Record<string, unknown>) => {
      if (!where) return true;
      return Object.entries(where).every(([key, value]) => (credential as any)[key] === value);
    };

    return {
      findOne: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        for (const credential of this.credentials.values()) {
          if (matchesWhere(credential, where)) return credential;
        }
        return null;
      },
      save: (cred: Credential) => {
        const now = new Date();
        if (!cred.id) cred.id = Math.random().toString(36).substr(2, 9);
        if (!cred.createdAt) cred.createdAt = now;
        cred.updatedAt = now;
        this.credentials.set(cred.id, cred);
        return cred;
      },
      create: (data: Partial<Credential>) => Object.assign(new Credential(), data),
      delete: (id: string) => this.credentials.delete(id),
    };
  }

  // OtpSecret methods
  getOtpSecretRepository() {
    const matchesWhere = (secret: OtpSecret, where?: Record<string, unknown>) => {
      if (!where) return true;
      return Object.entries(where).every(([key, value]) => (secret as any)[key] === value);
    };

    return {
      findOne: (options?: { where?: Record<string, unknown> }) => {
        const where = options?.where;
        for (const secret of this.otpSecrets.values()) {
          if (matchesWhere(secret, where)) return secret;
        }
        return null;
      },
      save: (otp: OtpSecret) => {
        if (!otp.id) otp.id = Math.random().toString(36).substr(2, 9);
        if (!otp.createdAt) otp.createdAt = new Date();
        this.otpSecrets.set(otp.id, otp);
        return otp;
      },
      create: (data: Partial<OtpSecret>) => Object.assign(new OtpSecret(), data),
      delete: (id: string) => this.otpSecrets.delete(id),
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