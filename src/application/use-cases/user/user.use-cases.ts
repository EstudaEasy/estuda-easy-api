import { Module } from '@nestjs/common';

import { UserRepositoryModule } from '@database/typeorm/repository/user/user.repository';

import { CreateUserUseCase } from './create-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';
import { FindOneUserUseCase } from './find-one-user.use-case';
import { FindUsersUseCase } from './find-users.use-case';
import { UpdateUserUseCase } from './update-user.use-case';

@Module({
  imports: [UserRepositoryModule],
  providers: [CreateUserUseCase, FindUsersUseCase, FindOneUserUseCase, UpdateUserUseCase, DeleteUserUseCase],
  exports: [CreateUserUseCase, FindUsersUseCase, FindOneUserUseCase, UpdateUserUseCase, DeleteUserUseCase]
})
export class UserUseCasesModule {}
