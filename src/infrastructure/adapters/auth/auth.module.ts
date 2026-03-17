import { Module } from '@nestjs/common';

import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [],
  providers: [AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy],
  exports: []
})
export class AuthAdapterModule {}
