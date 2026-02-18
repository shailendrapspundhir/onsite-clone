import { Global, Module } from '@nestjs/common';
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
import { InMemoryDatabaseModule } from '../in-memory-database/in-memory-database.module';
import { InMemoryDatabaseService } from '../in-memory-database/in-memory-database.service';
import { ValidationSchema } from './entities/validation-schema.entity';

@Global()
@Module({
  imports: [InMemoryDatabaseModule],
  controllers: [SchemaController],
  providers: [
    SchemaValidateInterceptor,
    {
      provide: SchemaRegistryService,
      useFactory: async (redis: RedisService, db: InMemoryDatabaseService) => {
        const registry = new SchemaRegistry();
        const client = redis.getClient();
        let redisSource: RedisSchemaSource | undefined;
        if (client) {
          redisSource = new RedisSchemaSource(client, { ttlSeconds: 3600 });
          registry.addSourceFirst(redisSource);
        }
        const repo = db.getValidationSchemaRepository();
        const dbSource = createDbSchemaSource({
          fetchByName: async (name: string) => {
            const schemas = repo
              .find()
              .filter((schema: ValidationSchema) => schema.name === name)
              .sort((a, b) => b.version - a.version);
            const row = schemas[0];
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
            const rows = repo.find();
            return [...new Set(rows.map((r: ValidationSchema) => r.name))];
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
      inject: [RedisService, InMemoryDatabaseService],
    },
    SchemaResolver,
  ],
  exports: [SchemaRegistryService, SchemaValidateInterceptor],
})
export class SchemaModule {}
