import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { USER_TYPES } from 'src/common/constants/user-types.constants';
import { CustomIsEnum } from 'src/common/request/validators/custom-validator';

export class UserTypeDto {
  @ApiPropertyOptional({ enum: USER_TYPES, required: false })
  @IsOptional()
  @CustomIsEnum(USER_TYPES)
  userType?: USER_TYPES;
}
