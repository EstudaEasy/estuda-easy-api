import { Inject, Injectable } from '@nestjs/common';

import { AuthenticatedUser } from '@adapters/auth/types/auth-user.type';
import { AuthErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { IUserSessionRepository, USER_SESSION_REPOSITORY_TOKEN } from '@domain/user-session/user-session.repository';
import { JwtProvider } from '@providers/jwt/jwt.provider';

type LogoutInput = {
  refreshToken: string;
};

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(USER_SESSION_REPOSITORY_TOKEN)
    private readonly userSessionRepository: IUserSessionRepository,
    private readonly jwtService: JwtProvider
  ) {}

  async execute(input: LogoutInput): Promise<void> {
    const { refreshToken } = input;

    const payload = this.jwtService.decodeToken<{ user: AuthenticatedUser }>(refreshToken);

    const foundToken = await this.userSessionRepository.findOne({ jti: payload.jti });
    if (!foundToken) {
      throw new Exception(AuthErrorCodes.REFRESH_TOKEN_NOT_FOUND);
    }

    if (foundToken.userId !== payload.user.id) {
      await this.userSessionRepository.delete({ userId: payload.user.id });
      throw new Exception(AuthErrorCodes.INVALID_REFRESH_TOKEN);
    }

    await this.userSessionRepository.delete({ jti: payload.jti });

    return;
  }
}
