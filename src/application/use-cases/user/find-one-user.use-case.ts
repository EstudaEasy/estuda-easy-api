import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository, UserRepositoryToken, WhereUser } from '@domain/repositories/user/user.repository';
import { UserEntity } from '@domain/entities/user/user.entity';
import { RelationsUser } from '@domain/entities/user/user.interface';

type FindOneUserInput = {
  filters: WhereUser;
  relations?: RelationsUser;
};

@Injectable()
export class FindOneUserUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: FindOneUserInput): Promise<UserEntity> {
    const { filters, relations } = input;

    const user = await this.userRepository.findOne(filters, relations);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }
}
