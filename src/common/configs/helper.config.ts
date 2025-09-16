import { registerAs } from '@nestjs/config';

export default registerAs(
  'helper',
  (): Record<string, any> => ({
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
    maxRequest: process.env.MAX_REQUEST_HIT || 10,
    maxRequestTime:
      process.env.MAX_REQUEST_HIT_EXPIRATION_TIME_IN_MILLI_SECONDS || 300,
    maxPasswordRequest: process.env.PASSWORD_MAX_REQUEST_LIMIT || 10,
  }),
);
