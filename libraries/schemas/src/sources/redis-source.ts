import type { ISchemaSource } from '../types';
import type { ValidationSchemaDoc } from '../types';

const KEY_PREFIX = 'schema:';
const DEFAULT_TTL = 3600;

/**
 * Load schemas from Redis.
 * Expects Redis client with get(key) returning JSON string.
 */
export interface RedisClientLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<unknown>;
}

export class RedisSchemaSource implements ISchemaSource {
  name = 'redis';
  private client: RedisClientLike;
  private keyPrefix: string;
  private ttlSeconds: number;

  constructor(
    client: RedisClientLike,
    options?: { keyPrefix?: string; ttlSeconds?: number },
  ) {
    this.client = client;
    this.keyPrefix = options?.keyPrefix ?? KEY_PREFIX;
    this.ttlSeconds = options?.ttlSeconds ?? DEFAULT_TTL;
  }

  async getSchema(schemaId: string): Promise<ValidationSchemaDoc | null> {
    const key = this.keyPrefix + schemaId;
    const raw = await this.client.get(key);
    if (!raw) return null;
    try {
      const doc = JSON.parse(raw) as ValidationSchemaDoc;
      doc.$id = doc.$id ?? schemaId;
      return doc;
    } catch {
      return null;
    }
  }

  /** Store a schema in Redis (for caching or admin override) */
  async setSchema(schemaId: string, doc: ValidationSchemaDoc): Promise<void> {
    const key = this.keyPrefix + schemaId;
    const value = JSON.stringify({ ...doc, $id: doc.$id ?? schemaId });
    await this.client.set(key, value, { EX: this.ttlSeconds });
  }
}
