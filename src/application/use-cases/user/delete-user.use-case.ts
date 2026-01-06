import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN, WhereUser } from '@domain/repositories/user/user.repository';
import { Exception, UserErrorCodes } from '@application/errors';

type DeleteUserInput = {
  filters: WhereUser;
};

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const { filters } = input;

    const user = await this.userRepository.findOne(filters);
    if (!user) {
      throw new Exception(UserErrorCodes.NOT_FOUND);
    }

    const deleted = await this.userRepository.delete(filters);
    if (!deleted) {
      throw new Exception(UserErrorCodes.NOT_DELETED);
    }
  }
}
