import { ApiTags } from "@nestjs/swagger";
import { UserService } from "../services/user.service";
import { Body, Controller, Post, SerializeOptions } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import { ResponseMessage } from "src/common/response/decorators/responseMessage.decorator";
import { ApiDocs } from "src/common/doc/common-docs";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { UserEntity } from "../entities/user.entity";
import { UserCreateDto } from "../dto/user.create.dto";
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
 
@SerializeOptions({
    groups: ADMIN_ONLY_GROUP,
  })
 
  @ApiTags('Users')
  @Controller('User')
  export class UserAdminController {
    constructor(
      private readonly _UserService: UserService,
      private _connection: DataSource,
    ) {}
  
  
    @ResponseMessage('User created successfully.')
    @ApiDocs({
      operation: 'Create new User',
     
       jwtAccessToken: true,
    })
    @Post('create')
    async create(
      @Body() body: UserCreateDto,
    ): Promise<IResponse<UserEntity>> {
     
  
      const queryRunner: QueryRunner = this._connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const data = await this._UserService.create(body, {
          entityManager: queryRunner.manager,
        });
        await queryRunner.commitTransaction();
        return { data };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
}