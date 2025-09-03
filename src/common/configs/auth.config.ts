import { registerAs } from '@nestjs/config';
import { seconds } from '../helper/constants/helper.function.constant';

export default registerAs('auth', () => {
  return {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
    AUTH_JWT_ACCESS_TOKEN_SECRET_KEY:process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY,
    AUTH_JWT_REFRESH_TOKEN_SECRET_KEY:process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_EPIRATION_TIME:seconds( process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED || '8h'),

  };
});
