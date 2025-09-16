import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { UserCreateDto } from '../dto/user.create.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { MarketingUserCreateDto } from '../dto/marketing.create.dto';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { DataSource, QueryRunner } from 'typeorm';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('users')
@Controller('user')
export class AdminUserController {
  constructor(
    private readonly _userService: UserService,
    private _connection: DataSource,
  ) {}

  @Get('/list/marketing')
  @ApiOperation({ summary: 'list employee' })
  async listMarketingEmployees(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<UserEntity>> {
    return this._userService.paginatedUser({
      ...paginateQueryDto,
      searchableColumns: ['firstName', 'lastName', 'email'],
      defaultSearchColumns: ['firstName', 'lastName'],
      defaultSortColumn: 'id',
      sortableColumns: ['id', 'firstName', 'lastName', 'createdAt'],
      options: {
        where: { role: 'marketing' },
      },
    });
  }


  @Get('/list/user')
  @ApiOperation({ summary: 'list user' })
  async listUser(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<UserEntity>> {
    return this._userService.paginatedUser({
      ...paginateQueryDto,
      searchableColumns: ['firstName', 'lastName', 'email'],
      defaultSearchColumns: ['firstName', 'lastName'],
      defaultSortColumn: 'id',
      sortableColumns: ['id', 'firstName', 'lastName', 'createdAt'],
      options: {
        where: { role: 'customer' },
      },
    });
  }


  @Post('create')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: UserCreateDto): Promise<
    IResponse<{
      otp: string;
      message: string;
    }>
  > {
    console.log("Make sure I am inside correct controller");
    const queryRunner: QueryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const data = await this._userService.register(
        registerDto,
        {
          entityManager: queryRunner.manager,
        }
      )
      data.user as UserEntity;
      await queryRunner.commitTransaction();
      
      return {
        data: {
          otp: data.otp,
          message: 'User Registered Successfully. Please verify your OTP'
        }
      }
      
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;

    } finally {
      await queryRunner.release();
    }
  }

  @Post('create-employee')
  @ApiOperation({ summary: 'Register a new employee' })
  async registerEmployee(@Body() registerDto: MarketingUserCreateDto): Promise<
    IResponse<{
      message: string;
    }>
  > {
    const result = await this._userService.registerEmployee(registerDto);

    result.user as UserEntity;

    return {
      data: {
        message: 'Employee registered successfully.',
      },
    };
  }

  @Delete('/soft-delete/:id')
  @ApiDocs({ operation: 'Soft delete User' })
  async softDeleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ User: UserEntity; message: string }>> {
    const found = await this._userService.getById(id);
    if (!found) throw new NotFoundException('Cannot find User');

    const User = await this._userService.softDelete(found);
    return {
      data: {
        User,
        message: 'User soft deleted successfully.',
      },
    };
  }

  @Patch('/restore/:id')
  @ApiDocs({ operation: 'Restore User' })
  async restoreById(
    @Param('id') id: number,
  ): Promise<IResponse<{ User: UserEntity; message: string }>> {
    await this._userService.restore({ where: { id } });
    const User = await this._userService.getById(id);
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
  async deleteById(
    @Param('id') id: number,
  ): Promise<IResponse<{ User: UserEntity; message: string }>> {
    const found = await this._userService.getById(id);
    if (!found) throw new NotFoundException('Cannot find User');

    const User = await this._userService.delete(found);
    return {
      data: {
        User,
        message: 'User permanently deleted successfully.',
      },
    };
  }
}
