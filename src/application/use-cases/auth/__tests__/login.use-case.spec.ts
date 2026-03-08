import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { compare } from 'bcrypt';

import { Exception, AuthErrorCodes } from '@application/errors';
import { UserMock } from '@domain/user/__mocks__/user.mock';
import { USER_REPOSITORY_TOKEN } from '@domain/user/user.repository';
import { UserSessionMock } from '@domain/user-session/__mocks__/user-session.mock';
import { USER_SESSION_REPOSITORY_TOKEN } from '@domain/user-session/user-session.repository';
import { JwtProvider } from '@providers/jwt/jwt.provider';

import { LoginUseCase } from '../login.use-case';

jest.mock('bcrypt');
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mocked-uuid')
}));

describe('Use Cases -> Auth -> Login', () => {
  let loginUseCase: LoginUseCase;

  const user = new UserMock();
  const userSession = new UserSessionMock();

  const userRepositoryMock = {
    findOne: jest.fn()
  };

  const userSessionRepositoryMock = {
    create: jest.fn()
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
        LoginUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock
        },
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

    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should login successfully', async () => {
    (compare as jest.Mock).mockResolvedValue(true);

    userRepositoryMock.findOne.mockResolvedValue(user);
    configServiceMock.getOrThrow.mockReturnValue({
      accessSecret: 'access-secret',
      refreshSecret: 'refresh-secret'
    });

    const oneWeekInSeconds = 7 * 24 * 60 * 60;
    const exp = Math.floor(Date.now() / 1000) + oneWeekInSeconds;

    jwtProviderMock.signToken.mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');
    jwtProviderMock.decodeToken.mockReturnValue({ exp });

    userSessionRepositoryMock.create.mockResolvedValue(userSession);

    const input = {
      email: user.email,
      password: 'password123',
      ipAddress: '127.0.0.1'
    };

    const result = await loginUseCase.execute(input);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(compare).toHaveBeenCalledWith('password123', user.password);
    expect(jwtProviderMock.signToken).toHaveBeenCalledTimes(2);
    expect(userSessionRepositoryMock.create).toHaveBeenCalledWith({
      userId: user.id,
      jti: 'mocked-uuid',
      ipAddress: '127.0.0.1',
      expiresAt: expect.any(Date)
    });
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    });
  });

  it('should not login - user not found', async () => {
    userRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      email: 'nonexistent@example.com',
      password: 'password123',
      ipAddress: '127.0.0.1'
    };

    await expect(loginUseCase.execute(input)).rejects.toThrow(new Exception(AuthErrorCodes.INVALID_CREDENTIALS));
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: input.email });
    expect(userSessionRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should not login - invalid password', async () => {
    (compare as jest.Mock).mockResolvedValue(false);

    userRepositoryMock.findOne.mockResolvedValue(user);

    const input = {
      email: user.email,
      password: 'wrong-password',
      ipAddress: '127.0.0.1'
    };

    await expect(loginUseCase.execute(input)).rejects.toThrow(new Exception(AuthErrorCodes.INVALID_CREDENTIALS));
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(compare).toHaveBeenCalledWith('wrong-password', user.password);
    expect(userSessionRepositoryMock.create).not.toHaveBeenCalled();
  });
});
