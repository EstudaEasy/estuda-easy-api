import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { JwtProvider } from '@providers/jwt/jwt.provider';

import { JwtAccessTokenStrategy } from './strategies/access-token/access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/refresh-token/refresh-token.strategy';

@Module({
  imports: [NestJwtModule.register({})],
  providers: [JwtProvider, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
  exports: [JwtProvider]
})
export class JwtModule {}
