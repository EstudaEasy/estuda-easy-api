import { Test } from '@nestjs/testing';

import { UserMock } from '@domain/entities/user/__mocks__/user.mock';

import { UpdateUserUseCase } from '../update-user.use-case';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user/user.repository';
import { hash } from 'bcrypt';
import { Exception, UserErrorCodes } from '@application/errors';

jest.mock('bcrypt');

describe('Use Cases -> User -> Update', () => {
  let updateUserUseCase: UpdateUserUseCase;

  const user = new UserMock();

  const userRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock
        }
      ]
    }).compile();

    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update user', async () => {
    (hash as jest.Mock).mockResolvedValue('hashed');

    userRepositoryMock.findOne.mockResolvedValue(user);
    userRepositoryMock.update.mockResolvedValue(user);

    const input = {
      filters: { id: user.id },
      data: {
        name: 'Updated Name',
        password: 'newpassword'
      }
    };

    const result = await updateUserUseCase.execute(input);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(userRepositoryMock.update).toHaveBeenCalledWith(input.filters, { ...input.data, password: 'hashed' });
    expect(result).toEqual(user);
    expect(hash).toHaveBeenCalledTimes(1);
  });

  it('should update user without password', async () => {
    userRepositoryMock.findOne.mockResolvedValue(user);
    userRepositoryMock.update.mockResolvedValue(user);

    const input = {
      filters: { id: user.id },
      data: {
        name: 'Updated Name'
      }
    };

    const result = await updateUserUseCase.execute(input);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(userRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(user);
  });

  it('should not update - user not found', async () => {
    userRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: user.id },
      data: {
        name: 'Updated Name'
      }
    };

    await expect(updateUserUseCase.execute(input)).rejects.toThrow(new Exception(UserErrorCodes.NOT_FOUND));
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - failed to update', async () => {
    userRepositoryMock.findOne.mockResolvedValue(user);
    userRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: user.id },
      data: {
        name: 'Updated Name'
      }
    };

    await expect(updateUserUseCase.execute(input)).rejects.toThrow(new Exception(UserErrorCodes.NOT_UPDATED));
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(userRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
  });
});
