import { Module } from '@nestjs/common';

import { AuthUseCasesModule } from '@application/use-cases/auth/auth.use-cases';

import { AuthController } from './auth.controller';

@Module({
  imports: [AuthUseCasesModule],
  controllers: [AuthController]
})
export class AuthModule {}
