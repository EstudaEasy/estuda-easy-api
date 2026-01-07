import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserSessionModel } from '@database/typeorm/models/user-session/user-session.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { UserSessionMock } from '@domain/entities/user-session/__mocks__/user-session.mock';

import { UserSessionRepository } from '../user-session.repository';

describe('TypeOrm -> User Session Repository -> Find One', () => {
  const userSessionMock = new UserSessionMock();

  let userSessionRepository: UserSessionRepository;
  let userSessionRepositoryMock: Repository<UserSessionModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSessionRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(UserSessionModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    userSessionRepository = module.get<UserSessionRepository>(UserSessionRepository);
    userSessionRepositoryMock = module.get<Repository<UserSessionModel>>(getRepositoryToken(UserSessionModel));

    findOneSpy = jest.spyOn(userSessionRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a user session - user session found', async () => {
    findOneSpy.mockResolvedValue(userSessionMock);

    const res = await userSessionRepository.findOne({ jti: userSessionMock.jti });

    expect(findOneSpy).toHaveBeenCalledWith({ where: { jti: userSessionMock.jti }, relations: undefined });
    expect(res).toEqual(userSessionMock);
  });

  it('should return null - user session not found', async () => {
    findOneSpy.mockResolvedValue(null);

    const res = await userSessionRepository.findOne({ jti: 'non-existent' });

    expect(findOneSpy).toHaveBeenCalledWith({ where: { jti: 'non-existent' }, relations: undefined });
    expect(res).toBeNull();
  });
});
