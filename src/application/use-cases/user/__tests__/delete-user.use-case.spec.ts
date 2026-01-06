import { Test } from '@nestjs/testing';

import { UserMock } from '@domain/entities/user/__mocks__/user.mock';

import { DeleteUserUseCase } from '../delete-user.use-case';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user/user.repository';
import { Exception, UserErrorCodes } from '@application/errors';

describe('Use Cases -> User -> Delete', () => {
  let deleteUserUseCase: DeleteUserUseCase;

  const user = new UserMock();

  const userRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock
        }
      ]
    }).compile();

    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete user', async () => {
    userRepositoryMock.findOne.mockResolvedValue(user);
    userRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: user.id }
    };

    await expect(deleteUserUseCase.execute(input)).resolves.toBeUndefined();

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(userRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should not delete - user not found', async () => {
    userRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: user.id }
    };

    await expect(deleteUserUseCase.execute(input)).rejects.toThrow(new Exception(UserErrorCodes.NOT_FOUND));
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(userRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - failed to delete', async () => {
    userRepositoryMock.findOne.mockResolvedValue(user);
    userRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: user.id }
    };

    await expect(deleteUserUseCase.execute(input)).rejects.toThrow(new Exception(UserErrorCodes.NOT_DELETED));
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(userRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });
});
