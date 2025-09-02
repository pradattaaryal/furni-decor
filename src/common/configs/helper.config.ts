import { registerAs } from '@nestjs/config';
import { seconds } from '../helper/constants/helper.function.constant';

export default registerAs(
  'helper',
  (): Record<string, any> => ({
    salt: {
      length: 8,
    },
    jwt: {
      secretKey: '123456',
      expirationTime: seconds('1h'),
      notBeforeExpirationTime: seconds('0'),
    },
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
