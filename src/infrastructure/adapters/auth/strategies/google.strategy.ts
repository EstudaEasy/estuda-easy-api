import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { GoogleConfig } from '@config/google/config';

import { SocialAuthenticatedUser } from '../types/social-auth-user.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(readonly configService: ConfigService) {
    const googleConfig = configService.getOrThrow<GoogleConfig>('google');
    const baseUrl = configService.getOrThrow<string>('BASE_URL');

    super({
      clientID: googleConfig.auth.clientId,
      clientSecret: googleConfig.auth.clientSecret,
      callbackURL: `${baseUrl}/auth/google/callback`,
      scope: ['email', 'profile']
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile): SocialAuthenticatedUser {
    const { name, emails } = profile;

    return {
      name: `${name?.givenName} ${name?.familyName}`,
      email: emails?.[0].value as string
    };
  }
}
