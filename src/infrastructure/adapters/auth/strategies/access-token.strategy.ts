import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtConfig } from '@config/jwt/config';
import { DecodedJwtToken } from '@providers/jwt/types/decoded-jwt.type';

import { AuthenticatedUser } from '../types/auth-user.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {
  constructor(readonly configService: ConfigService) {
    const { accessSecret } = configService.getOrThrow<JwtConfig>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessSecret
    });
  }

  validate(payload: DecodedJwtToken & { user: AuthenticatedUser }): AuthenticatedUser {
    return {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
      role: payload.user.role
    };
  }
}
