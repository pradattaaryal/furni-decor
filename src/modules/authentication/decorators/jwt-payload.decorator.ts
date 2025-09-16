import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../strategies/jwt.strategy';

export const GetJwtPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const jwtPayload = request.user;
    if (!jwtPayload) throw new ForbiddenException('user not found');
    return jwtPayload;
  },
);
