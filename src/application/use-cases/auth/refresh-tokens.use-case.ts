import { randomUUID } from 'crypto';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtProvider } from '@providers/jwt/jwt.provider';
import {
  IUserSessionRepository,
  UserSessionRepositoryToken
} from '@domain/repositories/user-session/user-session.repository';
import { AuthenticatedUser } from '@adapters/jwt/strategies/types/authenticated-user.type';
import { JwtConfig } from '@config/jwt/config';

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
    @Inject(UserSessionRepositoryToken)
    private readonly userSessionRepository: IUserSessionRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtProvider
  ) {}

  async execute(input: RefreshTokensUserInput): Promise<RefreshTokensUserOutput> {
    const { refreshToken, ipAddress } = input;

    const decodedRefreshToken = this.jwtService.decodeToken<{ user: AuthenticatedUser }>(refreshToken);
    if (!decodedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { jti, user } = decodedRefreshToken;

    const foundToken = await this.userSessionRepository.findOne({ jti });
    if (!foundToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (foundToken.userId !== user.id) {
      await this.userSessionRepository.delete({ userId: user.id });
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userPayload: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email
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
