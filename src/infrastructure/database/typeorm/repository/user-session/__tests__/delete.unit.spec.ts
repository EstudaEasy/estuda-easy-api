import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UserSessionModel } from '@database/typeorm/models/user-session/user-session.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { UserSessionMock } from '@domain/entities/user-session/__mocks__/user-session.mock';

import { UserSessionRepository } from '../user-session.repository';

describe('TypeOrm -> User Session Repository -> Delete', () => {
  const userSessionMock = new UserSessionMock();

  let userSessionRepository: UserSessionRepository;
  let userSessionRepositoryMock: Repository<UserSessionModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSessionRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(UserSessionModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    userSessionRepository = module.get<UserSessionRepository>(UserSessionRepository);
    userSessionRepositoryMock = module.get<Repository<UserSessionModel>>(getRepositoryToken(UserSessionModel));

    deleteSpy = jest.spyOn(userSessionRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user session and return true - user session found', async () => {
    const deleteResult: DeleteResult = { affected: 1, raw: [] };

    deleteSpy.mockResolvedValue(deleteResult);

    const res = await userSessionRepository.delete({ jti: userSessionMock.jti });

    expect(deleteSpy).toHaveBeenCalledWith({ jti: userSessionMock.jti });
    expect(res).toBe(true);
  });

  it('should return false - user session not found', async () => {
    const deleteResult: DeleteResult = { affected: 0, raw: [] };

    deleteSpy.mockResolvedValue(deleteResult);

    const res = await userSessionRepository.delete({ jti: 'non-existent' });

    expect(deleteSpy).toHaveBeenCalledWith({ jti: 'non-existent' });
    expect(res).toBe(false);
  });
});
