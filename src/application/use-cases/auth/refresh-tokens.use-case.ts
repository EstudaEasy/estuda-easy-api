import { randomUUID } from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtProvider } from '@providers/jwt/jwt.provider';
import {
  IUserSessionRepository,
  USER_SESSION_REPOSITORY_TOKEN
} from '@domain/repositories/user-session/user-session.repository';
import { AuthenticatedUser } from '@adapters/jwt/strategies/types/authenticated-user.type';
import { JwtConfig } from '@config/jwt/config';
import { AuthErrorCodes, Exception } from '@application/errors';

type RefreshTokensUserInput = {
  refreshToken: string;
  ipAddress: string;
};

type RefreshTokensUserOutput = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    @Inject(USER_SESSION_REPOSITORY_TOKEN)
    private readonly userSessionRepository: IUserSessionRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtProvider
  ) {}

  async execute(input: RefreshTokensUserInput): Promise<RefreshTokensUserOutput> {
    const { refreshToken, ipAddress } = input;

    const decodedRefreshToken = this.jwtService.decodeToken<{ user: AuthenticatedUser }>(refreshToken);
    if (!decodedRefreshToken) {
      throw new Exception(AuthErrorCodes.INVALID_REFRESH_TOKEN);
    }

    const { jti, user } = decodedRefreshToken;

    const foundToken = await this.userSessionRepository.findOne({ jti });
    if (!foundToken) {
      throw new Exception(AuthErrorCodes.REFRESH_TOKEN_NOT_FOUND);
    }

    if (foundToken.userId !== user.id) {
      await this.userSessionRepository.delete({ userId: user.id });
      throw new Exception(AuthErrorCodes.INVALID_REFRESH_TOKEN);
    }

    const userPayload: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const jwtConfig = this.configService.getOrThrow<JwtConfig>('jwt');
    const newJti = randomUUID();

    const newAccessToken = await this.jwtService.signToken(
      { user: userPayload },
      { secret: jwtConfig.accessSecret, expiresIn: '15m' }
    );

    const newRefreshToken = await this.jwtService.signToken(
      { user: userPayload, jti },
      { secret: jwtConfig.refreshSecret, expiresIn: '7d' }
    );

    const { exp } = this.jwtService.decodeToken<{ user: AuthenticatedUser }>(refreshToken);
    const expiresAt = new Date(exp! * 1000);

    await this.userSessionRepository.delete({ jti });
    await this.userSessionRepository.create({
      userId: user.id,
      jti: newJti,
      ipAddress,
      expiresAt
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
