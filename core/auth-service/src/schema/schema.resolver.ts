import { Resolver, Query, Args } from '@nestjs/graphql';
import { SchemaRegistryService } from './schema-registry.service';

@Resolver()
export class SchemaResolver {
  constructor(private schemaRegistry: SchemaRegistryService) {}

  @Query(() => String, {
    name: 'validationSchema',
    description: 'Get a single validation schema by ID (JSON string). Reusable in web apps.',
    nullable: true,
  })
  async getSchema(@Args('id', { type: () => String }) id: string): Promise<string | null> {
    const doc = await this.schemaRegistry.getSchema(id);
    return doc ? JSON.stringify(doc) : null;
  }

  @Query(() => String, {
    name: 'validationSchemasCatalog',
    description: 'Get all schemas + error codes/messages as a single JSON string for web apps.',
  })
  async getFullCatalog(): Promise<string> {
    const catalog = await this.schemaRegistry.getFullCatalog();
    return JSON.stringify(catalog);
  }

  @Query(() => [String], {
    name: 'validationSchemaIds',
    description: 'List all available schema IDs.',
  })
  async listSchemaIds(): Promise<string[]> {
    return this.schemaRegistry.listSchemaIds();
  }
}
