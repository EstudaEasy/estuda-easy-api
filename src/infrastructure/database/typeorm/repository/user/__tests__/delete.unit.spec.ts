import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UserModel } from '@database/typeorm/models/user/user.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';

import { UserRepository } from '../user.repository';

describe('TypeOrm -> User Repository -> Delete', () => {
  const userMock = new UserMock();

  let userRepository: UserRepository;
  let userRepositoryMock: Repository<UserModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(UserModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userRepositoryMock = module.get<Repository<UserModel>>(getRepositoryToken(UserModel));

    deleteSpy = jest.spyOn(userRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user and return true - user found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await userRepository.delete({ id: userMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - user not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await userRepository.delete({ id: userMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
