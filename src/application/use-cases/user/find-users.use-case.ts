import { Inject, Injectable } from '@nestjs/common';

import { UserEntity } from '@domain/entities/user/user.entity';
import { RelationsUser } from '@domain/entities/user/user.interface';
import { IUserRepository, USER_REPOSITORY_TOKEN, FilterUser } from '@domain/repositories/user/user.repository';

type FindUsersInput = {
  filters?: FilterUser;
  relations?: RelationsUser;
};

type FindUsersOutput = {
  users: UserEntity[];
  total: number;
};

@Injectable()
export class FindUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: FindUsersInput = {}): Promise<FindUsersOutput> {
    const { filters, relations } = input;

    const { users, total } = await this.userRepository.find(filters, relations);

    return {
      users: users.map((user) => new UserEntity(user)),
      total
    };
  }
}
