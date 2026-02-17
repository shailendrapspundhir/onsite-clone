import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private redis: RedisService,
  ) {}

  async check(): Promise<{ status: string; service: string; database: boolean; redis: boolean }> {
    let database = false;
    try {
      await this.dataSource.query('SELECT 1');
      database = true;
    } catch {}

    let redis = false;
    try {
      const client = this.redis.getClient();
      if (client) {
        await client.ping();
        redis = true;
      }
    } catch {}

    const status = database && redis ? 'ok' : database ? 'degraded' : 'error';
    return { status, service: 'user-management-service', database, redis };
  }
}
