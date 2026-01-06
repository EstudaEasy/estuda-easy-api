import { Injectable } from '@nestjs/common';
import { JwtSignOptions, JwtVerifyOptions, JwtService } from '@nestjs/jwt';

import { DecodedJwtToken } from '@adapters/jwt/strategies/types/decoded-jwt.type';

@Injectable()
export class JwtProvider {
  constructor(private readonly jwtService: JwtService) {}

  signToken<T extends object>(payload: T, options?: JwtSignOptions): Promise<string> {
    return this.jwtService.signAsync<T>(payload, options);
  }

  decodeToken<T extends object>(token: string): T & DecodedJwtToken {
    return this.jwtService.decode<T & DecodedJwtToken>(token);
  }

  verifyToken<T extends object>(token: string, options?: JwtVerifyOptions): T {
    return this.jwtService.verify<T>(token, options);
  }
}
