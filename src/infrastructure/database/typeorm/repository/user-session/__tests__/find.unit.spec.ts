import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserSessionModel } from '@database/typeorm/models/user-session/user-session.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { UserSessionMock } from '@domain/entities/user-session/__mocks__/user-session.mock';

import { UserSessionRepository } from '../user-session.repository';

describe('TypeOrm -> User Session Repository -> Find', () => {
  const userSessionMocks = UserSessionMock.getList(3);

  let userSessionRepository: UserSessionRepository;
  let userSessionRepositoryMock: Repository<UserSessionModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSessionRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(UserSessionModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    userSessionRepository = module.get<UserSessionRepository>(UserSessionRepository);
    userSessionRepositoryMock = module.get<Repository<UserSessionModel>>(getRepositoryToken(UserSessionModel));

    findAndCountSpy = jest.spyOn(userSessionRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return user sessions with count', async () => {
    findAndCountSpy.mockResolvedValue([userSessionMocks, userSessionMocks.length]);

    const res = await userSessionRepository.find();

    expect(findAndCountSpy).toHaveBeenCalledWith({ where: {}, relations: undefined });
    expect(res).toEqual({ sessions: userSessionMocks, total: userSessionMocks.length });
  });

  it('should return empty array when no user sessions found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await userSessionRepository.find();

    expect(findAndCountSpy).toHaveBeenCalledWith({ where: {}, relations: undefined });
    expect(res).toEqual({ sessions: [], total: 0 });
  });
});
