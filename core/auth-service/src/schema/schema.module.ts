import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationSchema } from './entities/validation-schema.entity';
import {
  SchemaRegistry,
  FileSchemaSource,
  RedisSchemaSource,
  createDbSchemaSource,
} from '@onsite360/schemas';
import { SchemaRegistryService } from './schema-registry.service';
import { SchemaResolver } from './schema.resolver';
import { SchemaController } from './schema.controller';
import { SchemaValidateInterceptor } from './schema-validate.interceptor';
import { RedisService } from '../redis/redis.service';
import type { Repository } from 'typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ValidationSchema])],
  controllers: [SchemaController],
  providers: [
    SchemaValidateInterceptor,
    {
      provide: SchemaRegistryService,
      useFactory: async (redis: RedisService, repo: Repository<ValidationSchema>) => {
        const registry = new SchemaRegistry();
        const client = redis.getClient();
        let redisSource: RedisSchemaSource | undefined;
        if (client) {
          redisSource = new RedisSchemaSource(client, { ttlSeconds: 3600 });
          registry.addSourceFirst(redisSource);
        }
        const dbSource = createDbSchemaSource({
          fetchByName: async (name: string) => {
            const row = await repo.findOne({ where: { name }, order: { version: 'DESC' } });
            if (!row) return null;
            return {
              id: row.id,
              name: row.name,
              version: row.version,
              schema_json: row.schemaJson,
              created_at: row.createdAt,
              updated_at: row.updatedAt,
            };
          },
          listNames: async () => {
            const rows = await repo.find({ select: { name: true } });
            return [...new Set(rows.map((r) => r.name))];
          },
        });
        registry.addSourceLast(dbSource);
        const fileSource = new FileSchemaSource();
        registry.addSourceLast(fileSource);

        // Preload Redis with schemas from files
        if (redisSource) {
          const ids = await fileSource.listSchemaIds();
          for (const id of ids) {
            const schema = await fileSource.getSchema(id);
            if (schema) {
              await redisSource.setSchema(id, schema);
            }
          }
        }

        return new SchemaRegistryService(registry);
      },
      inject: [RedisService, getRepositoryToken(ValidationSchema)],
    },
    SchemaResolver,
  ],
  exports: [SchemaRegistryService, SchemaValidateInterceptor],
})
export class SchemaModule {}
