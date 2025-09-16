import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Patch,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { UserCreateDto } from '../dto/user.create.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { DataSource } from 'typeorm';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('users')
@Controller('user')
export class PublicUserController {
  constructor(
    private readonly _UserService: UserService,
    private _connection: DataSource,
  ) {}

  @Post('/create')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: UserCreateDto): Promise<
    IResponse<{
      otp: string;

      message: string;
    }>
  > {
    const queryRunner = this._connection.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this._UserService.register(
        registerDto,
        {
          entityManager: queryRunner.manager,
        }
      );

      result.user as UserEntity;
      await queryRunner.commitTransaction();
      
      return {
        data: {
          otp: result.otp,
          message: 'User registered successfully. Please verify your OTP.',
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release()
    }

    

    

    
  }
}
