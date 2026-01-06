import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';

import { Exception, UserErrorCodes } from '@application/errors';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user/user.repository';

import { CreateUserUseCase } from '../create-user.use-case';

jest.mock('bcrypt');

describe('Use Cases -> User -> Create', () => {
  let createUserUseCase: CreateUserUseCase;

  const user = new UserMock();

  const userRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock
        }
      ]
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create user', async () => {
    (hash as jest.Mock).mockResolvedValue('hashed');

    userRepositoryMock.findOne.mockResolvedValue(null);
    userRepositoryMock.create.mockResolvedValue(user);

    const input = {
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        birthdate: user.birthdate,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoUrl
      }
    };

    const result = await createUserUseCase.execute(input);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(userRepositoryMock.create).toHaveBeenCalledWith({ ...input.data, password: 'hashed' });
    expect(result).toEqual(user);
    expect(hash).toHaveBeenCalledTimes(1);
  });

  it('should not create - email is already in use', async () => {
    userRepositoryMock.findOne.mockResolvedValue(user);

    const input = {
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        birthdate: user.birthdate,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoUrl
      }
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow(new Exception(UserErrorCodes.EMAIL_ALREADY_IN_USE));
    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });
});
