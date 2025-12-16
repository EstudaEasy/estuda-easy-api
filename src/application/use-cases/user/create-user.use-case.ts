import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUser, IUserRepository, UserRepositoryToken } from '@domain/repositories/user/user.repository';
import { UserEntity } from '@domain/entities/user/user.entity';
import { hash } from 'bcrypt';

export interface CreateUserInput {
  data: CreateUser;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const { data } = input;

    const existingUser = await this.userRepository.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.userRepository.create({
      ...data,
      password: await hash(data.password, 10)
    });

    return new UserEntity(user);
  }
}
