import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserModel } from '@database/typeorm/models/user/user.model';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';

import { UserRepository } from '../user.repository';

describe('TypeOrm -> User Repository -> Find', () => {
  const userMocks = UserMock.getList(3);

  let userRepository: UserRepository;
  let userRepositoryMock: Repository<UserModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userRepositoryMock = module.get<Repository<UserModel>>(getRepositoryToken(UserModel));

    findAndCountSpy = jest.spyOn(userRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return users with count', async () => {
    findAndCountSpy.mockResolvedValue([userMocks, userMocks.length]);

    const res = await userRepository.find();

    expect(res).toEqual({ users: userMocks, total: 3 });
    expect(res.users).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no users found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await userRepository.find();

    expect(res).toEqual({ users: [], total: 0 });
    expect(res.users).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
