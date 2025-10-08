import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './services/authentication.service';
import { UserModule } from 'src/modules/user/user.module';
import { UserRepositoryModule } from 'src/modules/user/repositories/user.repostory.module';
import { OtpModule } from 'src/modules/otp/otp.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtKeysService } from 'src/modules/authentication/services/jwt-token.service';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { CartModule } from '../cart/cart.module';
import { UserEntity } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('auth.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: '8h' },
      }),
    }),
    UserModule,
    UserRepositoryModule,
    OtpModule,
    CartModule,
  ],
  controllers: [],
  providers: [
    AuthenticationService,
    JwtStrategy,
    LocalStrategy,
    JwtKeysService,
    GoogleStrategy,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
