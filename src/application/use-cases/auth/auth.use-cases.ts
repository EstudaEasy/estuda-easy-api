import { Module } from '@nestjs/common';

import { CacheModule } from '@adapters/cache/cache.module';
import { JwtModule } from '@adapters/jwt/jwt.module';
import { MailerModule } from '@adapters/mailer/mailer.module';
import { UserRepositoryModule } from '@database/typeorm/repository/user/user.repository';
import { UserSessionRepositoryModule } from '@database/typeorm/repository/user-session/user-session.repository';

import { LoginUseCase } from './login.use-case';
import { LogoutUseCase } from './logout.use-case';
import { RefreshTokensUseCase } from './refresh-tokens.use-case';
import { ResetPasswordUseCase } from './reset-password.use-case';
import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';
import { SocialLoginUseCase } from './social-login.use-case';

@Module({
  imports: [UserRepositoryModule, UserSessionRepositoryModule, CacheModule, JwtModule, MailerModule],
  providers: [
    LoginUseCase,
    LogoutUseCase,
    RefreshTokensUseCase,
    ResetPasswordUseCase,
    SendPasswordResetEmailUseCase,
    SocialLoginUseCase
  ],
  exports: [
    LoginUseCase,
    LogoutUseCase,
    RefreshTokensUseCase,
    ResetPasswordUseCase,
    SendPasswordResetEmailUseCase,
    SocialLoginUseCase
  ]
})
export class AuthUseCasesModule {}
