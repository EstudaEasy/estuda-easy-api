import { randomUUID } from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';

import { AuthenticatedUser } from '@adapters/auth/types/auth-user.type';
import { AuthErrorCodes, Exception } from '@application/errors';
import { JwtConfig } from '@config/jwt/config';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/user/user.repository';
import { IUserSessionRepository, USER_SESSION_REPOSITORY_TOKEN } from '@domain/user-session/user-session.repository';
import { JwtProvider } from '@providers/jwt/jwt.provider';

type LoginInput = {
  email: string;
  password: string;
  ipAddress: string;
};

type LoginOutput = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(USER_SESSION_REPOSITORY_TOKEN)
    private readonly userSessionRepository: IUserSessionRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtProvider
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const { email, password, ipAddress } = input;

    const user = await this.userRepository.findOne({ email });
    const isPasswordValid = user ? await compare(password, user?.password ?? '') : false;

    if (!user || !isPasswordValid) {
      throw new Exception(AuthErrorCodes.INVALID_CREDENTIALS);
    }

    const userPayload: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const jwtConfig = this.configService.getOrThrow<JwtConfig>('jwt');
    const jti = randomUUID();

    const accessToken = await this.jwtService.signToken(
      { user: userPayload },
      { secret: jwtConfig.accessSecret, expiresIn: '1m' }
    );

    const refreshToken = await this.jwtService.signToken(
      { user: userPayload, jti },
      { secret: jwtConfig.refreshSecret, expiresIn: '2m' }
    );

    const { exp } = this.jwtService.decodeToken<{ user: AuthenticatedUser }>(refreshToken);
    const expiresAt = new Date(exp! * 1000);

    await this.userSessionRepository.create({
      userId: user.id,
      jti,
      ipAddress,
      expiresAt
    });

    return { accessToken, refreshToken };
  }
}
