import { Module } from '@nestjs/common';

import { JwtModule } from '@adapters/jwt/jwt.module';
import { UserRepositoryModule } from '@database/typeorm/repository/user/user.repository';
import { UserSessionRepositoryModule } from '@database/typeorm/repository/user-session/user-session.repository';

import { LoginUseCase } from './login.use-case';
import { LogoutUseCase } from './logout.use-case';
import { RefreshTokensUseCase } from './refresh-tokens.use-case';

@Module({
  imports: [UserRepositoryModule, UserSessionRepositoryModule, JwtModule],
  providers: [LoginUseCase, LogoutUseCase, RefreshTokensUseCase],
  exports: [LoginUseCase, LogoutUseCase, RefreshTokensUseCase]
})
export class AuthUseCasesModule {}
