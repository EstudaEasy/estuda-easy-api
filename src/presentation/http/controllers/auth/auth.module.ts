import { Module } from '@nestjs/common';

import { AuthAdapterModule } from '@adapters/auth/auth.module';
import { AuthUseCasesModule } from '@application/use-cases/auth/auth.use-cases';

import { AuthController } from './auth.controller';

@Module({
  imports: [AuthUseCasesModule, AuthAdapterModule],
  controllers: [AuthController]
})
export class AuthModule {}
