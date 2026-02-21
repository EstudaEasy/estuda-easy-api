import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { Exception, UserErrorCodes } from '@application/errors';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { USER_REPOSITORY_TOKEN } from '@domain/repositories/user/user.repository';
import { CacheProvider } from '@providers/cache/cache.provider';
import { JwtProvider } from '@providers/jwt/jwt.provider';
import { MailerProvider } from '@providers/mailer/mailer.provider';

import { SendPasswordResetEmailUseCase } from '../send-password-reset-email.use-case';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mocked-reset-code-uuid')
}));

describe('Use Cases -> Auth -> Send Password Reset Email', () => {
  let sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase;

  const user = new UserMock();

  const userRepositoryMock = {
    findOne: jest.fn()
  };

  const cacheProviderMock = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  };

  const mailerProviderMock = {
    send: jest.fn(),
    templates: {
      passwordReset: jest.fn()
    }
  };

  const configServiceMock = {
    getOrThrow: jest.fn()
  };

  const jwtProviderMock = {
    signToken: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SendPasswordResetEmailUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock
        },
        {
          provide: CacheProvider,
          useValue: cacheProviderMock
        },
        {
          provide: MailerProvider,
          useValue: mailerProviderMock
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

    sendPasswordResetEmailUseCase = module.get<SendPasswordResetEmailUseCase>(SendPasswordResetEmailUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should send password reset email successfully', async () => {
    userRepositoryMock.findOne.mockResolvedValue(user);

    configServiceMock.getOrThrow.mockReturnValue({
      passwordResetSecret: 'password-reset-secret'
    });

    jwtProviderMock.signToken.mockResolvedValue('password-reset-token');

    const mockMailTemplate = {
      subject: 'Password Reset',
      html: '<p>Reset your password</p>'
    };
    mailerProviderMock.templates.passwordReset.mockReturnValue(mockMailTemplate);
    mailerProviderMock.send.mockResolvedValue(undefined);
    cacheProviderMock.del.mockResolvedValue(undefined);
    cacheProviderMock.set.mockResolvedValue(undefined);

    const input = {
      email: user.email
    };

    await sendPasswordResetEmailUseCase.execute(input);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(cacheProviderMock.del).toHaveBeenCalledWith(`password-reset-code-${user.id}`);
    expect(jwtProviderMock.signToken).toHaveBeenCalledWith(
      { email: user.email, resetCode: 'mocked-reset-code-uuid' },
      { secret: 'password-reset-secret', expiresIn: 3600 }
    );
    expect(cacheProviderMock.set).toHaveBeenCalledWith(
      `password-reset-code-${user.id}`,
      'mocked-reset-code-uuid',
      3600000
    );
    expect(mailerProviderMock.templates.passwordReset).toHaveBeenCalledWith(user.name, 'password-reset-token', 60);
    expect(mailerProviderMock.send).toHaveBeenCalledWith({
      to: user.email,
      subject: mockMailTemplate.subject,
      html: mockMailTemplate.html
    });
  });

  it('should not send password reset email - user not found', async () => {
    userRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      email: 'nonexistent@example.com'
    };

    await expect(sendPasswordResetEmailUseCase.execute(input)).rejects.toThrow(new Exception(UserErrorCodes.NOT_FOUND));
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: input.email });
    expect(jwtProviderMock.signToken).not.toHaveBeenCalled();
    expect(mailerProviderMock.send).not.toHaveBeenCalled();
  });
});
