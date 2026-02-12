import { Inject, Injectable } from '@nestjs/common';

import { Exception, UserErrorCodes } from '@application/errors';
import { UserEntity } from '@domain/entities/user/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
  FilterUser,
  RelationsUser
} from '@domain/repositories/user/user.repository';

type FindOneUserInput = {
  filters: FilterUser;
  relations?: RelationsUser;
};

@Injectable()
export class FindOneUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: FindOneUserInput): Promise<UserEntity> {
    const { filters, relations } = input;

    const user = await this.userRepository.findOne(filters, relations);
    if (!user) {
      throw new Exception(UserErrorCodes.NOT_FOUND);
    }

    return new UserEntity(user);
  }
}
