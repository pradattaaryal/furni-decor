import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  clientSecret: process.env.STRIPE_SECRET_KEY || undefined,
  apiVersion: process.env.API_VERSION || '2025-08-27.basil',
  stripe_webhook_secret: process.env.STRIPE_WEB_HOOK_SECRET_KEY || undefined,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || undefined,
}));
