// src/common/configs/email.config.ts
import { registerAs } from '@nestjs/config';

export const MailConfig = registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 456,
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  adminEmail: process.env.ADMIN_EMAIL,
}));
