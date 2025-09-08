import { registerAs } from '@nestjs/config';
export default registerAs(
  'app',
  (): Record<string, any> => ({
    http: {
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT
        ? Number.parseInt(process.env.HTTP_PORT)
        : 3000,
    },
    env: process.env.APP_ENV,
    email: process.env.APP_EMAIL,
  }),
);
