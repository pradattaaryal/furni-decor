import { Body, Controller, Delete, NotFoundException, Param, Patch, Post, SerializeOptions } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { UserCreateDto } from '../dto/user.create.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { MarketingUserCreateDto } from '../dto/marketing.create.dto';
import { ApiDocs } from 'src/common/doc/common-docs';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('users')
@Controller('user')
export class AdminUserController {
  constructor(private readonly _UserService: UserService) {}

  @Post('/create')
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

  @Post('/create-employee')
  @ApiOperation({ summary: 'Register a new employee' })
  async registerEmployee(@Body() registerDto: MarketingUserCreateDto): Promise<
    IResponse<{
      message: string;
    }>
  > {
    const result = await this._UserService.registerEmployee(registerDto);

    result.user as UserEntity;

    return {
      data: {
        message: 'User registered successfully. Please verify your OTP.',
      },
    };
  }

  @Delete('/soft-delete/:id') 
    @ApiDocs({ operation: 'Soft delete User' })
    async softDeleteById(@Param('id') id: number): Promise<IResponse<{ User: UserEntity; message: string }>> {
      const found = await this._UserService.getById(id);
      if (!found) throw new NotFoundException('Cannot find User');
  
      const User = await this._UserService.softDelete(found);
      return {
        data: {
          User,
          message: 'User soft deleted successfully.',
        },
      };
    }
  
    @Patch('/restore/:id')
    @ApiDocs({ operation: 'Restore User' })
    async restoreById(@Param('id') id: number): Promise<IResponse<{ User: UserEntity; message: string }>> {
      await this._UserService.restore({ where: { id } });
      const User = await this._UserService.getById(id);
      if (!User) throw new NotFoundException('Cannot find User');
      return {
        data: {
          User,
          message: 'User restored successfully.',
        },
      };
    }
  
    @Delete('/hard/:id')
    @ApiDocs({ operation: 'Hard delete User' })
    async deleteById(@Param('id') id: number): Promise<IResponse<{ User: UserEntity; message: string }>> {
      const found = await this._UserService.getById(id);
      if (!found) throw new NotFoundException('Cannot find User');
  
      const User = await this._UserService.delete(found);
      return {
        data: {
          User,
          message: 'User permanently deleted successfully.',
        },
      };
    }









}
