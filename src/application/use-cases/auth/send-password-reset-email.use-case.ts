import { randomUUID } from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserErrorCodes } from '@application/errors';
import { JwtConfig } from '@config/jwt/config';
import { Exception } from '@core/exceptions';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/user/user.repository';
import { CacheProvider } from '@providers/cache/cache.provider';
import { JwtProvider } from '@providers/jwt/jwt.provider';
import { MailerProvider } from '@providers/mailer/mailer.provider';

import { PasswordResetTokenPayload } from './types/password-reset-payload.type';

type SendPasswordResetEmailInput = {
  email: string;
};

@Injectable()
export class SendPasswordResetEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly cacheProvider: CacheProvider,
    private readonly mailerProvider: MailerProvider,
    private readonly configService: ConfigService,
    private readonly jwtProvider: JwtProvider
  ) {}

  async execute(input: SendPasswordResetEmailInput): Promise<void> {
    const { email } = input;

    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new Exception(UserErrorCodes.NOT_FOUND);
    }

    const resetCode = randomUUID();
    const expiresIn = { minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1000 };

    const { passwordResetSecret } = this.configService.getOrThrow<JwtConfig>('jwt');
    const payload: PasswordResetTokenPayload = { email, resetCode };

    const token = await this.jwtProvider.signToken(payload, {
      secret: passwordResetSecret,
      expiresIn: expiresIn.seconds
    });

    await this.cacheProvider.del(`password-reset-code-${user.id}`);
    await this.cacheProvider.set(`password-reset-code-${user.id}`, resetCode, expiresIn.milliseconds);

    const mailTemplate = this.mailerProvider.templates.passwordReset(user.name, token, expiresIn.minutes);
    await this.mailerProvider.send({ to: email, ...mailTemplate });
  }
}
