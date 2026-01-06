import { Test } from '@nestjs/testing';

import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user/user.repository';

import { FindUsersUseCase } from '../find-users.use-case';

describe('Use Cases -> User -> Find', () => {
  let findUsersUseCase: FindUsersUseCase;

  const users = UserMock.getList(2);
  const total = users.length;

  const userRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindUsersUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock
        }
      ]
    }).compile();

    findUsersUseCase = module.get<FindUsersUseCase>(FindUsersUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find users', async () => {
    userRepositoryMock.find.mockResolvedValue({ users, total });

    const input = {
      filters: { name: 'test' },
      relations: {}
    };

    const result = await findUsersUseCase.execute(input);

    expect(userRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.users).toEqual(users);
    expect(result.total).toBe(total);
  });

  it('should find users without filters', async () => {
    userRepositoryMock.find.mockResolvedValue({ users: [], total: 0 });

    const result = await findUsersUseCase.execute();

    expect(userRepositoryMock.find).toHaveBeenCalledWith(undefined, undefined);
    expect(result.users).toEqual([]);
    expect(result.total).toBe(0);
  });
});
