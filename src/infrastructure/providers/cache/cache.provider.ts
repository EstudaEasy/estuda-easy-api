import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheProvider {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  set<T>(key: string, value: T, ttlMs?: number): Promise<T> {
    return this.cacheManager.set<T>(key, value, ttlMs);
  }

  del(key: string): Promise<boolean> {
    return this.cacheManager.del(key);
  }

  clear(): Promise<boolean> {
    return this.cacheManager.clear();
  }
}
