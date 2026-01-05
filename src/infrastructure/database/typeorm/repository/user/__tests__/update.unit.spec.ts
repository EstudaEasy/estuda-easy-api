import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { UserModel } from '@database/typeorm/models/user/user.model';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';

import { UserRepository } from '../user.repository';

describe('TypeOrm -> User Repository -> Update', () => {
  const userMock = new UserMock();

  let userRepository: UserRepository;
  let userRepositoryMock: Repository<UserModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userRepositoryMock = module.get<Repository<UserModel>>(getRepositoryToken(UserModel));

    updateSpy = jest.spyOn(userRepositoryMock, 'update');
    findOneSpy = jest.spyOn(userRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a user - user updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(userMock);

    const res = await userRepository.update({ id: userMock.id }, { name: 'Updated Name' });

    expect(res).toStrictEqual(userMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - user not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await userRepository.update({ id: userMock.id }, { name: 'Updated Name' });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
