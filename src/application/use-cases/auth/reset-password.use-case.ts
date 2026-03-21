import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';

import { AuthErrorCodes, UserErrorCodes } from '@application/errors';
import { JwtConfig } from '@config/jwt/config';
import { Exception } from '@core/exceptions';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/user/user.repository';
import { CacheProvider } from '@providers/cache/cache.provider';
import { JwtProvider } from '@providers/jwt/jwt.provider';

import { PasswordResetTokenPayload } from './types/password-reset-payload.type';

type ResetPasswordInput = {
  token: string;
  password: string;
  passwordConfirmation: string;
};

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly cacheProvider: CacheProvider,
    private readonly configService: ConfigService,
    private readonly jwtProvider: JwtProvider
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const { password, passwordConfirmation, token } = input;

    if (password !== passwordConfirmation) {
      throw new Exception(AuthErrorCodes.PASSWORD_CONFIRMATION_MISMATCH);
    }

    const { passwordResetSecret } = this.configService.getOrThrow<JwtConfig>('jwt');
    let decodedToken: PasswordResetTokenPayload;

    try {
      decodedToken = this.jwtProvider.verifyToken<PasswordResetTokenPayload>(token, { secret: passwordResetSecret });
    } catch {
      throw new Exception(AuthErrorCodes.INVALID_PASSWORD_RESET_TOKEN);
    }

    const { email, resetCode } = decodedToken;

    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new Exception(UserErrorCodes.NOT_FOUND);
    }

    const resetCodeStored = await this.cacheProvider.get<string>(`password-reset-code-${user.id}`);

    if (!resetCodeStored || resetCodeStored !== resetCode) {
      throw new Exception(AuthErrorCodes.INVALID_PASSWORD_RESET_TOKEN);
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.update({ id: user.id }, { password: hashedPassword });

    await this.cacheProvider.del(`password-reset-code-${user.id}`);
  }
}
