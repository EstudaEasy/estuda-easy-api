import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { JwtProvider } from '@providers/jwt/jwt.provider';

@Module({
  imports: [NestJwtModule.register({})],
  providers: [JwtProvider],
  exports: [JwtProvider]
})
export class JwtModule {}
