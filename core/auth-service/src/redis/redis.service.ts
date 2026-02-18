import { Injectable } from '@nestjs/common';
import { Logger as LoggerDecorator } from '@onsite360/common'; // @LoggerDecorator for input/output debug logs (pretty JSON on DEBUG)

@Injectable()
export class RedisService {
  private cache = new Map<string, { value: string; expiry?: number }>();

  @LoggerDecorator()
  getClient(): null {
    return null;
  }

  @LoggerDecorator()
  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  @LoggerDecorator()
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.cache.set(key, { value, expiry });
  }

  @LoggerDecorator()
  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  @LoggerDecorator()
  async setTokenCache(key: string, payload: string, ttlSeconds: number): Promise<void> {
    await this.set(key, payload, ttlSeconds);
  }
}
