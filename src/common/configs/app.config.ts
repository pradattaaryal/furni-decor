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
    maxDatabaseTableBackup: process.env.MAX_DATABASE_TABLE_BACKUP_FILE,
    maxDatabaseBackup: process.env.MAX_DATABASE_BACKUP_FILE,
    email: process.env.APP_EMAIL,
    geo_api_key: process.env.GEO_IP_API_KEY,
  }),
);
