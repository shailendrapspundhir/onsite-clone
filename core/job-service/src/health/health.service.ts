import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async check(): Promise<{ status: string; service: string; database: boolean; redis: boolean }> {
    const database = true; // In-memory database is always available
    const redis = true; // In-memory cache is always available

    const status = 'ok';
    return { status, service: 'job-service', database, redis };
  }
}
