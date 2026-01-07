import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserModel } from '@database/typeorm/models/user/user.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';

import { UserRepository } from '../user.repository';

describe('TypeOrm -> User Repository -> Find One', () => {
  const userMock = new UserMock();

  let userRepository: UserRepository;
  let userRepositoryMock: Repository<UserModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(UserModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userRepositoryMock = module.get<Repository<UserModel>>(getRepositoryToken(UserModel));

    findOneSpy = jest.spyOn(userRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(userMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a user - user found', async () => {
    const res = await userRepository.findOne({ name: userMock.name });

    expect(res).toStrictEqual(userMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - user not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await userRepository.findOne({ name: userMock.name });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
