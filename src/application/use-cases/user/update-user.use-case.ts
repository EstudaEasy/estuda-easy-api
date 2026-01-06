import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
  UpdateUser,
  WhereUser
} from '@domain/repositories/user/user.repository';
import { UserEntity } from '@domain/entities/user/user.entity';
import { hash } from 'bcrypt';
import { Exception, UserErrorCodes } from '@application/errors';

type UpdateUserInput = {
  filters: WhereUser;
  data: UpdateUser;
};

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: UpdateUserInput): Promise<UserEntity> {
    const { filters, data } = input;

    const existingUser = await this.userRepository.findOne(filters);
    if (!existingUser) {
      throw new Exception(UserErrorCodes.NOT_FOUND);
    }

    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.update(filters, data);
    if (!updatedUser) {
      throw new Exception(UserErrorCodes.NOT_UPDATED);
    }

    return new UserEntity(updatedUser);
  }
}
