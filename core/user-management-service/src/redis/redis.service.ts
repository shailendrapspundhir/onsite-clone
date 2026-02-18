import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  private cache = new Map<string, { value: string; expiry?: number }>();

  getClient(): null {
    return null;
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    try {
      return JSON.parse(item.value) as T;
    } catch {
      return item.value as unknown as T;
    }
  }

  async set(key: string, value: string | object, ttlSeconds?: number): Promise<void> {
    const v = typeof value === 'string' ? value : JSON.stringify(value);
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.cache.set(key, { value: v, expiry });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }
}
