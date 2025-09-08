import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { RequestParamRawGuard } from '../guards/request.param.guard';
import { REQUEST_PARAM_CLASS_DTOS_META_KEY } from '../request.constant';

export function RequestParamGuard(
  ...classValidation: ClassConstructor<any>[]
): MethodDecorator {
  return applyDecorators(
    UseGuards(RequestParamRawGuard),
    SetMetadata(REQUEST_PARAM_CLASS_DTOS_META_KEY, classValidation),
  );
}

//Puts metadata of the entity that is being used for that controller or CRUD of that entity
export function PutUsedEntityMetadata(entityName: string): ClassDecorator {
  return applyDecorators(SetMetadata('usedEntity', entityName));
}

export const GetPublicIP = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<string | null> => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const forwardedFor = request.headers['x-forwarded-for'];
      const ip = forwardedFor?.split(',')[0];
      // console.log('This is ip: ', ip);

      return ip || null;
    } catch (error) {
      // Return just the IP if geolocation fails
      return null;
    }
  },
);

export const GetCustomLang = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<string | null> => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const customLanguage = request.headers['x-custom-lang'];
      return customLanguage || null;
    } catch (error) {
      // Return just the IP if geolocation fails
      return null;
    }
  },
);
