import type { ISchemaSource } from '../types';
import type { ValidationSchemaDoc } from '../types';

/**
 * Load schemas from a database.
 * Implement this interface with your ORM (TypeORM, Prisma, etc.) or raw queries.
 */
export interface SchemaRow {
  id: string;
  name: string;
  version?: number;
  schema_json: string | Record<string, unknown>;
  created_at?: Date;
  updated_at?: Date;
}

export interface DbSchemaSourceOptions {
  /** Fetch a schema by name (and optionally version) */
  fetchByName: (name: string, version?: number) => Promise<SchemaRow | null>;
  /** Optional: list all schema names */
  listNames?: () => Promise<string[]>;
}

/**
 * Database schema source - adapt to your DB client.
 */
export class DbSchemaSource implements ISchemaSource {
  name = 'db';
  private fetchByName: (name: string, version?: number) => Promise<SchemaRow | null>;
  private listNames?: () => Promise<string[]>;

  constructor(options: DbSchemaSourceOptions) {
    this.fetchByName = options.fetchByName;
    this.listNames = options.listNames;
  }

  async getSchema(schemaId: string): Promise<ValidationSchemaDoc | null> {
    return this.getSchemaById(schemaId, undefined);
  }

  async getSchemaById(schemaId: string, version?: number): Promise<ValidationSchemaDoc | null> {
    const row = await this.fetchByName(schemaId, version);
    if (!row) return null;
    const raw = typeof row.schema_json === 'string' ? row.schema_json : JSON.stringify(row.schema_json);
    try {
      const doc = JSON.parse(raw) as ValidationSchemaDoc;
      doc.$id = doc.$id ?? schemaId;
      return doc;
    } catch {
      return null;
    }
  }

  async listSchemaIds(): Promise<string[]> {
    if (this.listNames) return this.listNames();
    return [];
  }
}

/**
 * Create a DB source that matches ISchemaSource.getSchema(schemaId) (no version in interface).
 * We use a wrapper that calls getSchema(id) and passes undefined for version.
 */
export function createDbSchemaSource(options: DbSchemaSourceOptions): ISchemaSource {
  const db = new DbSchemaSource(options);
  return {
    name: 'db',
    async getSchema(schemaId: string) {
      return db.getSchemaById(schemaId, undefined);
    },
    listSchemaIds: db.listSchemaIds?.bind(db),
  };
}
