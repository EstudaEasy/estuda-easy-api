import { Module } from '@nestjs/common';
import { UserUseCasesModule } from '@application/use-cases/user/user.use-cases';
import { UserController } from '@presentation/http/controllers/user/user.controller';

@Module({
  imports: [UserUseCasesModule],
  controllers: [UserController]
})
export class UserModule {}
