import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import configs from 'src/common/configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        BREVO_API_KEY: Joi.string().required(),
        VERIFICATION_OTP_TOKEN_SECRET_KEY: Joi.string().required(),
      }),
    }),
  ],
})
export class BrevoModule {
  constructor() {}
}
