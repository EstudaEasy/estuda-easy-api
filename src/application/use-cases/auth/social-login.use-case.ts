import { randomUUID } from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';

import { AuthenticatedUser } from '@adapters/auth/types/auth-user.type';
import { JwtConfig } from '@config/jwt/config';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '@domain/user/user.repository';
import { IUserSessionRepository, USER_SESSION_REPOSITORY_TOKEN } from '@domain/user-session/user-session.repository';
import { JwtProvider } from '@providers/jwt/jwt.provider';

type SocialLoginInput = {
  name: string;
  email: string;
  ipAddress: string;
};

type SocialLoginOutput = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class SocialLoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(USER_SESSION_REPOSITORY_TOKEN)
    private readonly userSessionRepository: IUserSessionRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtProvider
  ) {}

  async execute(input: SocialLoginInput): Promise<SocialLoginOutput> {
    const { name, email, ipAddress } = input;

    let user = await this.userRepository.findOne({ email });

    if (!user) {
      user = await this.userRepository.create({ name, email, password: await hash(randomUUID(), 10) });
    }

    const userPayload: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return await this.generateTokens(userPayload, ipAddress);
  }

  private async generateTokens(
    user: AuthenticatedUser,
    ipAddress: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessSecret, refreshSecret } = this.configService.getOrThrow<JwtConfig>('jwt');
    const jti = randomUUID();

    const accessToken = await this.jwtService.signToken({ user }, { secret: accessSecret, expiresIn: '15m' });
    const refreshToken = await this.jwtService.signToken({ user, jti }, { secret: refreshSecret, expiresIn: '7d' });

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
