import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  clientSecret: process.env.STRIPE_SECRET_KEY || undefined,
  apiVersion: process.env.API_VERSION || '2023-10-16',
}));
