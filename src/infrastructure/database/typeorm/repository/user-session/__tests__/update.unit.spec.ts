import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { UserSessionModel } from '@database/typeorm/models/user-session/user-session.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { UserSessionMock } from '@domain/entities/user-session/__mocks__/user-session.mock';

import { UserSessionRepository } from '../user-session.repository';

describe('TypeOrm -> User Session Repository -> Update', () => {
  const userSessionMock = new UserSessionMock();

  let userSessionRepository: UserSessionRepository;
  let userSessionRepositoryMock: Repository<UserSessionModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSessionRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(UserSessionModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    userSessionRepository = module.get<UserSessionRepository>(UserSessionRepository);
    userSessionRepositoryMock = module.get<Repository<UserSessionModel>>(getRepositoryToken(UserSessionModel));

    updateSpy = jest.spyOn(userSessionRepositoryMock, 'update');
    findOneSpy = jest.spyOn(userSessionRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a user session - user session updated', async () => {
    const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
    const updatedSession = { ...userSessionMock, expiresAt: new Date() };

    updateSpy.mockResolvedValue(updateResult);
    findOneSpy.mockResolvedValue(updatedSession);

    const res = await userSessionRepository.update(
      { jti: userSessionMock.jti },
      { expiresAt: updatedSession.expiresAt }
    );

    expect(updateSpy).toHaveBeenCalledWith({ jti: userSessionMock.jti }, { expiresAt: updatedSession.expiresAt });
    expect(findOneSpy).toHaveBeenCalledWith({ where: { jti: userSessionMock.jti } });
    expect(res).toEqual(updatedSession);
  });

  it('should return null - user session not found', async () => {
    const updateResult: UpdateResult = { affected: 0, raw: [], generatedMaps: [] };

    updateSpy.mockResolvedValue(updateResult);

    const res = await userSessionRepository.update({ jti: 'non-existent' }, { expiresAt: new Date() });

    expect(updateSpy).toHaveBeenCalledWith({ jti: 'non-existent' }, { expiresAt: expect.any(Date) });
    expect(findOneSpy).not.toHaveBeenCalled();
    expect(res).toBeNull();
  });
});
