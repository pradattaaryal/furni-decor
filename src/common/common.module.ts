import { Module } from '@nestjs/common/decorators';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { LoggerModule } from './logger/logger.module';
import configs from './configs';
import { ENUM_APP_ENVIRONMENT } from './constants/app.constant';
import { DatabaseModule } from './database/database.module';
import { DebuggerModule } from './debugger/debugger.module';
import { ErrorModule } from './error/error.module';
import { HelperModule } from './helper/helper.module';
import { RequestModule } from './request/request.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        APP_ENV: Joi.string()
          .valid(...Object.values(ENUM_APP_ENVIRONMENT))
          .default(ENUM_APP_ENVIRONMENT.DEVELOPMENT)
          .required(),
        // APP_EMAIL: Joi.string().email().required(),
        // HTTP_HOST: Joi.string().required(),
        // HTTP_PORT: Joi.number().required(),
        // DATABASE_TYPE: Joi.string().required(),
        // DATABASE_HOST: Joi.string().required(),
        // DATABASE_PORT: Joi.number().required(),
        // DATABASE_USERNAME: Joi.string().required(),
        // DATABASE_PASSWORD: Joi.string().required(),
        // DATABASE_NAME: Joi.string().required(),
        // IMG_MAX_FILE_SIZE: Joi.string().required(),
        // IMG_MAX_FILE: Joi.number().required(),
        // MAX_FILE_COUNT: Joi.number().required(),
        // MAX_REQUEST_HIT: Joi.number().required(),
        // MAX_REQUEST_HIT_EXPIRATION_TIME_IN_MILLI_SECONDS: Joi.number().required(),
        // PASSWORD_MAX_REQUEST_LIMIT: Joi.number().required(),

        // WORKER_IDLE_TIMEOUT_MILLISECONDS: Joi.number().required(),
        // WORKER_MAX_THREADS: Joi.number().required(),
        // WORKER_MIN_THREADS: Joi.number().required(),

        // EMAIL_VERIFICATION_TOKEN_SECRET_KEY: Joi.string().required(),
        // EMAIL_VERIFICATION_TOKEN_EXPIRED_IN_SECONDS: Joi.number().required(),

        // REDIS_HOST: Joi.string().required(),
        // REDIS_PORT: Joi.number().required(),

        // MAIL_HOST: Joi.string().required(),
        // MAIL_PORT: Joi.number().default(456),
        // MAIL_USERNAME: Joi.string().required(),
        // MAIL_PASSWORD: Joi.string().required(),
        // ADMIN_EMAIL: Joi.string().email().required(),
        // FRONT_END_BASE_URL: Joi.string().required(),
        // GOOGLE_CLIENT_ID: Joi.string().required(),
        // GOOGLE_CLIENT_SECRET: Joi.string().required(),
        // GOOGLE_CALL_BACK_URL: Joi.string().required(),

        // TWILIO_CONTACT_NUMBER: Joi.string().required(),
        // TWILIO_ACCOUNT_SID: Joi.string().required(),
        // TWILIO_AUTH_TOKEN: Joi.string().required(),

        // STRIPE_SECRET_KEY: Joi.string().required(),
        // STRIPE_WEB_HOOK_SECRET_KEY: Joi.string().required(),

        // PAYPAL_CLIENT_ID: Joi.string().required(),
        // PAYPAL_CLIENT_SECRET: Joi.string().required(),
        // PAYPAL_API_BASE: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    DatabaseModule,
    RequestModule,
    ResponseModule,
    ErrorModule,
    HelperModule,
    DebuggerModule,
    LoggerModule,
  ],
})
export class CommonModule {}
