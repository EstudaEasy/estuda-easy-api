import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { Exception, AuthErrorCodes } from '@application/errors';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { UserSessionMock } from '@domain/entities/user-session/__mocks__/user-session.mock';
import { USER_SESSION_REPOSITORY_TOKEN } from '@domain/repositories/user-session/user-session.repository';
import { JwtProvider } from '@providers/jwt/jwt.provider';

import { RefreshTokensUseCase } from '../refresh-tokens.use-case';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'new-mocked-uuid')
}));

describe('Use Cases -> Auth -> Refresh Tokens', () => {
  let refreshTokensUseCase: RefreshTokensUseCase;

  const user = new UserMock();
  const userSession = new UserSessionMock({ userId: user.id, jti: 'old-jti' });

  const userSessionRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn()
  };

  const configServiceMock = {
    getOrThrow: jest.fn()
  };

  const jwtProviderMock = {
    signToken: jest.fn(),
    decodeToken: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RefreshTokensUseCase,
        {
          provide: USER_SESSION_REPOSITORY_TOKEN,
          useValue: userSessionRepositoryMock
        },
        {
          provide: ConfigService,
          useValue: configServiceMock
        },
        {
          provide: JwtProvider,
          useValue: jwtProviderMock
        }
      ]
    }).compile();

    refreshTokensUseCase = module.get<RefreshTokensUseCase>(RefreshTokensUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should refresh tokens successfully', async () => {
    const oneWeekInSeconds = 7 * 24 * 60 * 60;
    const exp = Math.floor(Date.now() / 1000) + oneWeekInSeconds;

    jwtProviderMock.decodeToken
      .mockReturnValueOnce({
        jti: 'old-jti',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
      .mockReturnValueOnce({ exp });

    userSessionRepositoryMock.findOne.mockResolvedValue(userSession);
    configServiceMock.getOrThrow.mockReturnValue({
      accessSecret: 'access-secret',
      refreshSecret: 'refresh-secret'
    });

    jwtProviderMock.signToken.mockResolvedValueOnce('new-access-token').mockResolvedValueOnce('new-refresh-token');

    userSessionRepositoryMock.delete.mockResolvedValue(undefined);
    userSessionRepositoryMock.create.mockResolvedValue({ ...userSession, jti: 'new-mocked-uuid' });

    const input = {
      refreshToken: 'valid-refresh-token',
      ipAddress: '127.0.0.1'
    };

    const result = await refreshTokensUseCase.execute(input);

    expect(jwtProviderMock.decodeToken).toHaveBeenCalledTimes(2);
    expect(userSessionRepositoryMock.findOne).toHaveBeenCalledWith({ jti: 'old-jti' });
    expect(jwtProviderMock.signToken).toHaveBeenCalledTimes(2);
    expect(userSessionRepositoryMock.delete).toHaveBeenCalledWith({ jti: 'old-jti' });
    expect(userSessionRepositoryMock.create).toHaveBeenCalledWith({
      userId: user.id,
      jti: 'new-mocked-uuid',
      ipAddress: '127.0.0.1',
      expiresAt: expect.any(Date)
    });
    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token'
    });
  });

  it('should not refresh tokens - invalid refresh token (decode returns null)', async () => {
    jwtProviderMock.decodeToken.mockReturnValue(null);

    const input = {
      refreshToken: 'invalid-refresh-token',
      ipAddress: '127.0.0.1'
    };

    await expect(refreshTokensUseCase.execute(input)).rejects.toThrow(
      new Exception(AuthErrorCodes.INVALID_REFRESH_TOKEN)
    );
    expect(jwtProviderMock.decodeToken).toHaveBeenCalledWith('invalid-refresh-token');
    expect(userSessionRepositoryMock.findOne).not.toHaveBeenCalled();
  });

  it('should not refresh tokens - refresh token not found in database', async () => {
    jwtProviderMock.decodeToken.mockReturnValue({
      jti: 'nonexistent-jti',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    userSessionRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      refreshToken: 'valid-but-not-stored-token',
      ipAddress: '127.0.0.1'
    };

    await expect(refreshTokensUseCase.execute(input)).rejects.toThrow(
      new Exception(AuthErrorCodes.REFRESH_TOKEN_NOT_FOUND)
    );
    expect(userSessionRepositoryMock.findOne).toHaveBeenCalledWith({ jti: 'nonexistent-jti' });
    expect(userSessionRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should not refresh tokens - user id mismatch (delete all sessions and throw)', async () => {
    const differentUserId = user.id + 1;

    jwtProviderMock.decodeToken.mockReturnValue({
      jti: 'old-jti',
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
      refreshToken: 'malicious-refresh-token',
      ipAddress: '127.0.0.1'
    };

    await expect(refreshTokensUseCase.execute(input)).rejects.toThrow(
      new Exception(AuthErrorCodes.INVALID_REFRESH_TOKEN)
    );
    expect(userSessionRepositoryMock.findOne).toHaveBeenCalledWith({ jti: 'old-jti' });
    expect(userSessionRepositoryMock.delete).toHaveBeenCalledWith({ userId: differentUserId });
    expect(userSessionRepositoryMock.create).not.toHaveBeenCalled();
  });
});
