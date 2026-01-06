import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN, WhereUser } from '@domain/repositories/user/user.repository';
import { UserEntity } from '@domain/entities/user/user.entity';
import { RelationsUser } from '@domain/entities/user/user.interface';
import { Exception, UserErrorCodes } from '@application/errors';

type FindOneUserInput = {
  filters: WhereUser;
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
