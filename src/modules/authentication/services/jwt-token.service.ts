// src/common/utils/jwt-keys.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtKeysService {
  constructor(private readonly configService: ConfigService) {}

  // Get the Refresh Token private key
  getRefreshPrivateKey(): string {
    const key = this.configService
      .get<string>('database.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY')
      ?.trim();

    if (!key) {
      throw new Error('JWT_REFRESH_PRIVATE_KEY not set in environment');
    }

    return key;
  }

  // Get the Access Token private key
  getAccessTokenPrivateKey(): string {
    const key = this.configService
      .get<string>('auth.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY')
      ?.trim();

    if (!key) {
      throw new Error('JWT_ACCESS_PRIVATE_KEY not set in environment');
    }

    return key;
  }
}
