import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN, WhereUser } from '@domain/repositories/user/user.repository';
import { UserEntity } from '@domain/entities/user/user.entity';
import { RelationsUser } from '@domain/entities/user/user.interface';

type FindUsersInput = {
  filters?: WhereUser;
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
