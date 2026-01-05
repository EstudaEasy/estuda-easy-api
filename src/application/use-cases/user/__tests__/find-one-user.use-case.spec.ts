import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UserMock } from '@domain/entities/user/__mocks__/user.mock';

import { FindOneUserUseCase } from '../find-one-user.use-case';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user/user.repository';

describe('Use Cases -> User -> Find One', () => {
  let findOneUserUseCase: FindOneUserUseCase;

  const user = new UserMock();

  const userRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneUserUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock
        }
      ]
    }).compile();

    findOneUserUseCase = module.get<FindOneUserUseCase>(FindOneUserUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one user', async () => {
    userRepositoryMock.findOne.mockResolvedValue(user);

    const input = {
      filters: { id: user.id },
      relations: {}
    };

    const result = await findOneUserUseCase.execute(input);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(user);
  });

  it('should not find user - user not found', async () => {
    userRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: user.id }
    };

    await expect(findOneUserUseCase.execute(input)).rejects.toThrow(NotFoundException);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
