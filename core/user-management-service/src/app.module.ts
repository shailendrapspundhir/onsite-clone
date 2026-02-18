import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import type { Request, Response } from 'express';
import { ThrottlerModule } from '@nestjs/throttler';
import { WorkerModule } from './worker/worker.module';
import { EmployerModule } from './employer/employer.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { SchemaController } from './schema.controller';
import { SchemaModule } from './schema/schema.module';
import { InMemoryDatabaseModule } from './in-memory-database/in-memory-database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    InMemoryDatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
    }),
    RedisModule,
    WorkerModule,
    EmployerModule,
    HealthModule,
    SchemaModule,
  ],
  controllers: [SchemaController],
})
export class AppModule {}
