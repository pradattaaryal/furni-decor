import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import authConfig from 'src/common/configs/auth.config';

export type SocialProfile = {
  provider: 'google';
  providerId: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth config is missing');
    }

    const options: StrategyOptions = {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL:
        config.GOOGLE_CALLBACK_URL || '/backend/api/admin/auth/google/callback',
      scope: ['profile', 'email'],
    };

    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<SocialProfile> {
    if (!profile)
      throw new UnauthorizedException('No profile returned from Google');

    const email = profile.emails?.[0]?.value;
    const avatar = profile.photos?.[0]?.value;

    return {
      provider: 'google',
      providerId: profile.id,
      email,
      displayName: profile.displayName,
      avatarUrl: avatar,
    };
  }
}
