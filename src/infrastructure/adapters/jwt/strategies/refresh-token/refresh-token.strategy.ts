import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '../types/authenticated-user.type';
import { JwtConfig } from '@config/jwt/config';
import { DecodedJwtToken } from '../types/decoded-jwt.type';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(readonly configService: ConfigService) {
    const { refreshSecret } = configService.getOrThrow<JwtConfig>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: refreshSecret
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
