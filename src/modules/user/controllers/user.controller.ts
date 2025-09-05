import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { UserCreateDto } from '../dto/user.create.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('Users')
@Controller('User')
export class UserAdminController {
  constructor(
    private readonly _UserService: UserService,
   ) {}

    @Post('/register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() registerDto: UserCreateDto): Promise<
      IResponse<{
        otp: string;
  
        message: string;
      }>
    > {
      const result = await this._UserService.register(registerDto);
  
      result.user as UserEntity;
  
      return {
        data: {
          otp: result.otp,
  
          message: 'User registered successfully. Please verify your OTP.',
        },
      };
    }
}
