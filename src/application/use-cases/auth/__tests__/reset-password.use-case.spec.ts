import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';

import { AuthErrorCodes, UserErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { UserMock } from '@domain/user/__mocks__/user.mock';
import { USER_REPOSITORY_TOKEN } from '@domain/user/user.repository';
import { CacheProvider } from '@providers/cache/cache.provider';
import { JwtProvider } from '@providers/jwt/jwt.provider';

import { ResetPasswordUseCase } from '../reset-password.use-case';

jest.mock('bcrypt');

describe('Use Cases -> Auth -> Reset Password', () => {
  let resetPasswordUseCase: ResetPasswordUseCase;

  const user = new UserMock();

  const userRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  const cacheProviderMock = {
    get: jest.fn(),
    del: jest.fn()
  };

  const configServiceMock = {
    getOrThrow: jest.fn()
  };

  const jwtProviderMock = {
    verifyToken: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResetPasswordUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMock
        },
        {
          provide: CacheProvider,
          useValue: cacheProviderMock
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

    resetPasswordUseCase = module.get<ResetPasswordUseCase>(ResetPasswordUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should reset password successfully', async () => {
    const resetCode = 'valid-reset-code';
    const newPassword = 'NewPassword123!';

    configServiceMock.getOrThrow.mockReturnValue({
      passwordResetSecret: 'password-reset-secret'
    });

    jwtProviderMock.verifyToken.mockReturnValue({
      email: user.email,
      resetCode
    });

    userRepositoryMock.findOne.mockResolvedValue(user);
    cacheProviderMock.get.mockResolvedValue(resetCode);
    (hash as jest.Mock).mockResolvedValue('hashed-password');
    userRepositoryMock.update.mockResolvedValue(undefined);
    cacheProviderMock.del.mockResolvedValue(undefined);

    const input = {
      token: 'valid-token',
      password: newPassword,
      passwordConfirmation: newPassword
    };

    await resetPasswordUseCase.execute(input);

    expect(jwtProviderMock.verifyToken).toHaveBeenCalledWith('valid-token', {
      secret: 'password-reset-secret'
    });
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(cacheProviderMock.get).toHaveBeenCalledWith(`password-reset-code-${user.id}`);
    expect(hash).toHaveBeenCalledWith(newPassword, 10);
    expect(userRepositoryMock.update).toHaveBeenCalledWith({ id: user.id }, { password: 'hashed-password' });
    expect(cacheProviderMock.del).toHaveBeenCalledWith(`password-reset-code-${user.id}`);
  });

  it('should not reset password - password confirmation mismatch', async () => {
    const input = {
      token: 'valid-token',
      password: 'NewPassword123!',
      passwordConfirmation: 'DifferentPassword123!'
    };

    await expect(resetPasswordUseCase.execute(input)).rejects.toThrow(
      new Exception(AuthErrorCodes.PASSWORD_CONFIRMATION_MISMATCH)
    );
    expect(jwtProviderMock.verifyToken).not.toHaveBeenCalled();
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not reset password - invalid token', async () => {
    configServiceMock.getOrThrow.mockReturnValue({
      passwordResetSecret: 'password-reset-secret'
    });

    jwtProviderMock.verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const input = {
      token: 'invalid-token',
      password: 'NewPassword123!',
      passwordConfirmation: 'NewPassword123!'
    };

    await expect(resetPasswordUseCase.execute(input)).rejects.toThrow(
      new Exception(AuthErrorCodes.INVALID_PASSWORD_RESET_TOKEN)
    );
    expect(jwtProviderMock.verifyToken).toHaveBeenCalledWith('invalid-token', {
      secret: 'password-reset-secret'
    });
    expect(userRepositoryMock.findOne).not.toHaveBeenCalled();
  });

  it('should not reset password - user not found', async () => {
    const resetCode = 'valid-reset-code';

    configServiceMock.getOrThrow.mockReturnValue({
      passwordResetSecret: 'password-reset-secret'
    });

    jwtProviderMock.verifyToken.mockReturnValue({
      email: 'nonexistent@example.com',
      resetCode
    });

    userRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      token: 'valid-token',
      password: 'NewPassword123!',
      passwordConfirmation: 'NewPassword123!'
    };

    await expect(resetPasswordUseCase.execute(input)).rejects.toThrow(new Exception(UserErrorCodes.NOT_FOUND));
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not reset password - reset code not found in cache', async () => {
    const resetCode = 'valid-reset-code';

    configServiceMock.getOrThrow.mockReturnValue({
      passwordResetSecret: 'password-reset-secret'
    });

    jwtProviderMock.verifyToken.mockReturnValue({
      email: user.email,
      resetCode
    });

    userRepositoryMock.findOne.mockResolvedValue(user);
    cacheProviderMock.get.mockResolvedValue(null);

    const input = {
      token: 'valid-token',
      password: 'NewPassword123!',
      passwordConfirmation: 'NewPassword123!'
    };

    await expect(resetPasswordUseCase.execute(input)).rejects.toThrow(
      new Exception(AuthErrorCodes.INVALID_PASSWORD_RESET_TOKEN)
    );
    expect(cacheProviderMock.get).toHaveBeenCalledWith(`password-reset-code-${user.id}`);
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not reset password - reset code mismatch', async () => {
    const resetCode = 'valid-reset-code';
    const storedResetCode = 'different-reset-code';

    configServiceMock.getOrThrow.mockReturnValue({
      passwordResetSecret: 'password-reset-secret'
    });

    jwtProviderMock.verifyToken.mockReturnValue({
      email: user.email,
      resetCode
    });

    userRepositoryMock.findOne.mockResolvedValue(user);
    cacheProviderMock.get.mockResolvedValue(storedResetCode);

    const input = {
      token: 'valid-token',
      password: 'NewPassword123!',
      passwordConfirmation: 'NewPassword123!'
    };

    await expect(resetPasswordUseCase.execute(input)).rejects.toThrow(
      new Exception(AuthErrorCodes.INVALID_PASSWORD_RESET_TOKEN)
    );
    expect(cacheProviderMock.get).toHaveBeenCalledWith(`password-reset-code-${user.id}`);
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });
});
