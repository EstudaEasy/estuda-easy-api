import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserModel } from '@database/typeorm/models/user/user.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';

import { UserRepository } from '../user.repository';

describe('TypeOrm -> User Repository -> Create', () => {
  const userMock = new UserMock();

  let userRepository: UserRepository;
  let userRepositoryMock: Repository<UserModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(UserModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userRepositoryMock = module.get<Repository<UserModel>>(getRepositoryToken(UserModel));

    createSpy = jest.spyOn(userRepositoryMock, 'create');
    createSpy.mockResolvedValue(userMock);

    saveSpy = jest.spyOn(userRepositoryMock, 'save');
    saveSpy.mockResolvedValue(userMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a user', async () => {
    const res = await userRepository.create({
      name: userMock.name,
      email: userMock.email,
      password: userMock.password
    });

    expect(res).toStrictEqual(userMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
