import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository, UserRepositoryToken, UpdateUser, WhereUser } from '@domain/repositories/user/user.repository';
import { UserEntity } from '@domain/entities/user/user.entity';
import { hash } from 'bcrypt';

type UpdateUserInput = {
  filters: WhereUser;
  data: UpdateUser;
};

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: UpdateUserInput): Promise<UserEntity> {
    const { filters, data } = input;

    const existingUser = await this.userRepository.findOne(filters);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.update(filters, data);
    if (!updatedUser) {
      throw new ConflictException('Failed to update user');
    }

    return new UserEntity(updatedUser);
  }
}
