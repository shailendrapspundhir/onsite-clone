import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { SchemaModule } from './schema/schema.module';
import { RedisModule } from './redis/redis.module';
import { InMemoryDatabaseModule } from './in-memory-database/in-memory-database.module';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    InMemoryDatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }: { req: Request; res: Response }) => { 
        return { req, res }
      },
    }),
    AuthModule,
    HealthModule,
    SchemaModule,
  ],
})
export class AppModule {}
