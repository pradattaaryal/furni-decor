import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtKeysService } from 'src/modules/authentication/services/jwt-token.service';
import { Request } from 'express';
import { UserRole } from 'src/modules/user/constant/user-type.constant';

export type JwtPayload = {
  sub: number;
  roles: UserRole;
  [key: string]: any;
}

export type AuthenticatedRequest = Request & { user: JwtPayload };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(keys: JwtKeysService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: keys.getAccessTokenPrivateKey(),
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
