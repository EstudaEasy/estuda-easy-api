import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { CacheProvider } from '@providers/cache/cache.provider';

@Module({
  imports: [NestCacheModule.register()],
  providers: [CacheProvider],
  exports: [CacheProvider]
})
export class CacheModule {}
