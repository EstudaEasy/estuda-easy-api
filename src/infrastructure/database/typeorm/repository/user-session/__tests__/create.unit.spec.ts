import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserSessionModel } from '@database/typeorm/models/user-session/user-session.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { UserSessionMock } from '@domain/entities/user-session/__mocks__/user-session.mock';

import { UserSessionRepository } from '../user-session.repository';

describe('TypeOrm -> User Session Repository -> Create', () => {
  const userSessionMock = new UserSessionMock();

  let userSessionRepository: UserSessionRepository;
  let userSessionRepositoryMock: Repository<UserSessionModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSessionRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(UserSessionModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    userSessionRepository = module.get<UserSessionRepository>(UserSessionRepository);
    userSessionRepositoryMock = module.get<Repository<UserSessionModel>>(getRepositoryToken(UserSessionModel));

    createSpy = jest.spyOn(userSessionRepositoryMock, 'create');
    createSpy.mockReturnValue(userSessionMock);

    saveSpy = jest.spyOn(userSessionRepositoryMock, 'save');
    saveSpy.mockResolvedValue(userSessionMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a user session', async () => {
    const res = await userSessionRepository.create({
      jti: userSessionMock.jti,
      userId: userSessionMock.userId,
      ipAddress: userSessionMock.ipAddress,
      expiresAt: userSessionMock.expiresAt
    });

    expect(createSpy).toHaveBeenCalledWith({
      jti: userSessionMock.jti,
      userId: userSessionMock.userId,
      ipAddress: userSessionMock.ipAddress,
      expiresAt: userSessionMock.expiresAt
    });
    expect(saveSpy).toHaveBeenCalledWith(userSessionMock);
    expect(res).toEqual(userSessionMock);
  });
});
