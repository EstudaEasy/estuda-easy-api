import { Test } from '@nestjs/testing';

import { AuthErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { UserMock } from '@domain/user/__mocks__/user.mock';
import { UserSessionMock } from '@domain/user-session/__mocks__/user-session.mock';
import { USER_SESSION_REPOSITORY_TOKEN } from '@domain/user-session/user-session.repository';
import { JwtProvider } from '@providers/jwt/jwt.provider';

import { LogoutUseCase } from '../logout.use-case';

describe('Use Cases -> Auth -> Logout', () => {
  let logoutUseCase: LogoutUseCase;

  const user = new UserMock();
  const userSession = new UserSessionMock({ userId: user.id, jti: 'test-jti' });

  const userSessionRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  const jwtProviderMock = {
    decodeToken: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LogoutUseCase,
        {
          provide: USER_SESSION_REPOSITORY_TOKEN,
          useValue: userSessionRepositoryMock
        },
        {
          provide: JwtProvider,
          useValue: jwtProviderMock
        }
      ]
    }).compile();

    logoutUseCase = module.get<LogoutUseCase>(LogoutUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should logout successfully', async () => {
    jwtProviderMock.decodeToken.mockReturnValue({
      jti: 'test-jti',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    userSessionRepositoryMock.findOne.mockResolvedValue(userSession);
    userSessionRepositoryMock.delete.mockResolvedValue(undefined);

    const input = {
      refreshToken: 'valid-refresh-token'
    };

    await logoutUseCase.execute(input);

    expect(jwtProviderMock.decodeToken).toHaveBeenCalledWith('valid-refresh-token');
    expect(userSessionRepositoryMock.findOne).toHaveBeenCalledWith({ jti: 'test-jti' });
    expect(userSessionRepositoryMock.delete).toHaveBeenCalledWith({ jti: 'test-jti' });
  });

  it('should not logout - refresh token not found', async () => {
    jwtProviderMock.decodeToken.mockReturnValue({
      jti: 'invalid-jti',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    userSessionRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      refreshToken: 'invalid-refresh-token'
    };

    await expect(logoutUseCase.execute(input)).rejects.toThrow(new Exception(AuthErrorCodes.REFRESH_TOKEN_NOT_FOUND));
    expect(jwtProviderMock.decodeToken).toHaveBeenCalledWith('invalid-refresh-token');
    expect(userSessionRepositoryMock.findOne).toHaveBeenCalledWith({ jti: 'invalid-jti' });
    expect(userSessionRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not logout - user id mismatch (delete all sessions and throw)', async () => {
    const differentUserId = user.id + 1;

    jwtProviderMock.decodeToken.mockReturnValue({
      jti: 'test-jti',
      user: {
        id: differentUserId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    userSessionRepositoryMock.findOne.mockResolvedValue(userSession);
    userSessionRepositoryMock.delete.mockResolvedValue(undefined);

    const input = {
      refreshToken: 'malicious-refresh-token'
    };

    await expect(logoutUseCase.execute(input)).rejects.toThrow(new Exception(AuthErrorCodes.INVALID_REFRESH_TOKEN));
    expect(jwtProviderMock.decodeToken).toHaveBeenCalledWith('malicious-refresh-token');
    expect(userSessionRepositoryMock.findOne).toHaveBeenCalledWith({ jti: 'test-jti' });
    expect(userSessionRepositoryMock.delete).toHaveBeenCalledWith({ userId: differentUserId });
  });
});
