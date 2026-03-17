import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';

import { UserMock } from '@domain/user/__mocks__/user.mock';
import { USER_REPOSITORY_TOKEN } from '@domain/user/user.repository';
import { UserSessionMock } from '@domain/user-session/__mocks__/user-session.mock';
import { USER_SESSION_REPOSITORY_TOKEN } from '@domain/user-session/user-session.repository';
import { JwtProvider } from '@providers/jwt/jwt.provider';

import { SocialLoginUseCase } from '../social-login.use-case';

jest.mock('bcrypt');
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mocked-uuid')
}));

describe('Use Cases -> Auth -> Social Login', () => {
  let socialLoginUseCase: SocialLoginUseCase;

  const user = new UserMock();
  const userSession = new UserSessionMock({ userId: user.id });

  const userRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn()
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
        SocialLoginUseCase,
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

    socialLoginUseCase = module.get<SocialLoginUseCase>(SocialLoginUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should login existing user and generate tokens', async () => {
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

    const input = { name: user.name, email: user.email, ipAddress: '127.0.0.1' };

    const result = await socialLoginUseCase.execute(input);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
    expect(jwtProviderMock.signToken).toHaveBeenCalledTimes(2);
    expect(userSessionRepositoryMock.create).toHaveBeenCalledWith({
      userId: user.id,
      jti: 'mocked-uuid',
      ipAddress: '127.0.0.1',
      expiresAt: expect.any(Date)
    });
    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
  });

  it('should create new user when not found and then generate tokens', async () => {
    (hash as jest.Mock).mockResolvedValue('hashed-password');

    userRepositoryMock.findOne.mockResolvedValue(null);
    userRepositoryMock.create.mockResolvedValue(user);
    configServiceMock.getOrThrow.mockReturnValue({
      accessSecret: 'access-secret',
      refreshSecret: 'refresh-secret'
    });

    const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    jwtProviderMock.signToken.mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');
    jwtProviderMock.decodeToken.mockReturnValue({ exp });
    userSessionRepositoryMock.create.mockResolvedValue(userSession);

    const input = { name: 'New User', email: 'new@example.com', ipAddress: '127.0.0.1' };

    const result = await socialLoginUseCase.execute(input);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: input.email });
    expect(hash).toHaveBeenCalledWith('mocked-uuid', 10);
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      password: 'hashed-password'
    });
    expect(jwtProviderMock.signToken).toHaveBeenCalledTimes(2);
    expect(userSessionRepositoryMock.create).toHaveBeenCalledWith({
      userId: user.id,
      jti: 'mocked-uuid',
      ipAddress: '127.0.0.1',
      expiresAt: expect.any(Date)
    });
    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
  });
});
