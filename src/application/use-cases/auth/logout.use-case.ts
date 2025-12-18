import { AuthenticatedUser } from '@adapters/jwt/strategies/types/authenticated-user.type';
import {
  IUserSessionRepository,
  UserSessionRepositoryToken
} from '@domain/repositories/user-session/user-session.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtProvider } from '@providers/jwt/jwt.provider';

type LogoutInput = {
  refreshToken: string;
};

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(UserSessionRepositoryToken)
    private readonly userSessionRepository: IUserSessionRepository,
    private readonly jwtService: JwtProvider
  ) {}

  async execute(input: LogoutInput): Promise<void> {
    const { refreshToken } = input;

    const payload = this.jwtService.decodeToken<{ user: AuthenticatedUser }>(refreshToken);

    const foundToken = await this.userSessionRepository.findOne({ jti: payload.jti });
    if (!foundToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (foundToken.userId !== payload.user.id) {
      await this.userSessionRepository.delete({ userId: payload.user.id });
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.userSessionRepository.delete({ jti: payload.jti });

    return;
  }
}
