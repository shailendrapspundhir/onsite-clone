import { Injectable } from '@nestjs/common';
import { Logger as LoggerDecorator } from '@onsite360/common'; // @LoggerDecorator for input/output debug logs (pretty JSON on DEBUG)

@Injectable()
export class HealthService {
  @LoggerDecorator()
  async check(): Promise<{ status: string; service: string; database: boolean; redis: boolean }> {
    const database = true; // In-memory database is always available
    const redis = true; // In-memory cache is always available

    const status = 'ok';
    return { status, service: 'user-management-service', database, redis };
  }
}
