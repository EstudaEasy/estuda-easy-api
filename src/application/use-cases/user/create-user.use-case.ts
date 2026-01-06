import { Inject, Injectable } from '@nestjs/common';
import { CreateUser, IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/repositories/user/user.repository';
import { UserEntity } from '@domain/entities/user/user.entity';
import { hash } from 'bcrypt';
import { Exception, UserErrorCodes } from '@application/errors';

export interface CreateUserInput {
  data: CreateUser;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const { data } = input;

    const existingUser = await this.userRepository.findOne({ email: data.email });
    if (existingUser) {
      throw new Exception(UserErrorCodes.EMAIL_ALREADY_IN_USE);
    }

    const user = await this.userRepository.create({
      ...data,
      password: await hash(data.password, 10)
    });

    return new UserEntity(user);
  }
}
