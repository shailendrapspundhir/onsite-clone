import { Injectable } from '@nestjs/common';
import type { SchemaRegistry } from '@onsite360/schemas';
import type { ValidationSchemaDoc } from '@onsite360/schemas';
import type { ValidationResult } from '@onsite360/schemas';

@Injectable()
export class SchemaRegistryService {
  constructor(private readonly registry: SchemaRegistry) {}

  getSchema(schemaId: string): Promise<ValidationSchemaDoc | null> {
    return this.registry.getSchema(schemaId);
  }

  validate(schemaId: string, data: unknown): Promise<ValidationResult> {
    return this.registry.validate(schemaId, data);
  }

  getFullCatalog(): Promise<{
    schemas: Record<string, ValidationSchemaDoc>;
    errorCodes?: Record<string, string>;
    messages?: Record<string, string>;
  }> {
    return this.registry.getFullCatalog();
  }

  listSchemaIds(): Promise<string[]> {
    return this.registry.listSchemaIds();
  }
}