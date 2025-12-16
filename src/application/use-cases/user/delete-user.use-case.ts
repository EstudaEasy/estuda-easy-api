import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository, UserRepositoryToken, WhereUser } from '@domain/repositories/user/user.repository';

type DeleteUserInput = {
  filters: WhereUser;
};

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const { filters } = input;

    const user = await this.userRepository.findOne(filters);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deleted = await this.userRepository.delete(filters);
    if (!deleted) {
      throw new ConflictException('Failed to delete user');
    }
  }
}
