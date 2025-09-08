import { registerAs } from '@nestjs/config';

export default registerAs(
  'mail',
  (): Record<string, any> => ({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT ? Number.parseInt(process.env.MAIL_PORT) : 587,
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    service: process.env.MAIL_SERVICE || 'gmail',
  }),
);
