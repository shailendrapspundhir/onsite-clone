import type { ISchemaSource } from './types';
import type { ValidationSchemaDoc } from './types';
import { validateWithSchema } from './validator';
import type { ValidationResult } from './types';
// import { FileSchemaSource } from './sources/file-source';

export interface SchemaRegistryOptions {
  /** Ordered list of sources to try (first hit wins). Default: [redis, db, file] */
  sources?: ISchemaSource[];
  /** File system path for default file source (if not provided in sources) */
  fileDir?: string;
}

/**
 * Schema registry: resolve schema by name from multiple sources (Redis, DB, file).
 * Use validate() to validate data and get errors with messages and codes from the schema.
 */
export class SchemaRegistry {
  private sources: ISchemaSource[];
  // private fileSource: FileSchemaSource | null = null;

  constructor(options: SchemaRegistryOptions = {}) {
    this.sources = options.sources ?? [];
    // if (!this.sources.length) {
    //   this.fileSource = new FileSchemaSource(options.fileDir);
    //   this.sources = [this.fileSource];
    // }
  }

  /** Add a source (e.g. Redis) at the beginning so it is tried first */
  addSourceFirst(source: ISchemaSource): void {
    this.sources.unshift(source);
  }

  /** Add a source at the end (e.g. file fallback) */
  addSourceLast(source: ISchemaSource): void {
    this.sources.push(source);
  }

  /** Get schema by ID from first available source (order: sources list) */
  async getSchema(schemaId: string): Promise<ValidationSchemaDoc | null> {
    for (const source of this.sources) {
      const doc = await source.getSchema(schemaId);
      if (doc) return doc;
    }
    return null;
  }

  /** Get raw schema JSON for API delivery (e.g. to web apps). Same as getSchema. */
  async getSchemaForApi(schemaId: string): Promise<ValidationSchemaDoc | null> {
    return this.getSchema(schemaId);
  }

  /** Validate data against named schema. Returns errors with message and code from schema. */
  async validate(schemaId: string, data: unknown): Promise<ValidationResult> {
    const doc = await this.getSchema(schemaId);
    if (!doc) {
      return {
        valid: false,
        errors: [
          {
            instancePath: '/',
            keyword: 'schema',
            message: `Schema not found: ${schemaId}`,
            code: 'SCHEMA_NOT_FOUND',
          },
        ],
      };
    }
    return validateWithSchema(doc, data);
  }

  /** List all schema IDs (from first source that supports listSchemaIds) */
  async listSchemaIds(): Promise<string[]> {
    for (const source of this.sources) {
      if (source.listSchemaIds) {
        const ids = await source.listSchemaIds();
        if (ids.length) return ids;
      }
    }
    return [];
  }

  /**
   * Get full catalog: all schemas + error codes as a single JSON for web apps.
   */
  async getFullCatalog(): Promise<{
    schemas: Record<string, ValidationSchemaDoc>;
    errorCodes?: Record<string, string>;
    messages?: Record<string, string>;
  }> {
    const ids = await this.listSchemaIds();
    const schemas: Record<string, ValidationSchemaDoc> = {};
    for (const id of ids) {
      const doc = await this.getSchema(id);
      if (doc) schemas[id] = doc;
    }
    // FileSchemaSource and error code loading removed for frontend compatibility
    return { schemas };
  }
}
