import { Injectable, BadRequestException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserCreateDto } from '../dto/user.create.dto';
 import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import { UserRepository } from '../repositories/user.repository';
import { IUpdateOptions } from 'src/common/database/interfaces/updateOption.interface';
import { Not } from 'typeorm';
import { IFindOneOptions } from 'src/common/database/interfaces/findOption.interface';

@Injectable()
export class UserService {
  constructor(private readonly _userRepo: UserRepository) {}

  async create(
    createDto: UserCreateDto,
    options?: ICreateOptions,
  ): Promise<UserEntity> {
    await this.throwErrorIfExistingUserByEmailFound(
        createDto.email,
        null,
        options,
      );
      const data = await this._userRepo._create(createDto, {
        entityManager: options?.entityManager,
      });
      return data;
  }



  async throwErrorIfExistingUserByEmailFound(
    incomingEmail: string,
    repo?: UserEntity | null,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<void> {
    const where = {
      email: incomingEmail,
    };
    if (repo) {
      where['id'] = Not(repo.id);
    }
    const existingUser: UserEntity | null = await this._userRepo._findOne(
      {
        options: { where: where },
        withDeleted: true,
        entityManager: options?.entityManager,
      },
    );
    if (existingUser) {
      throw new BadRequestException('User already exists by that email');
    }
  }
 async getById(
    id: number,
    options?: IFindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const data = await this._userRepo._findOneById(id, options);
    return data;
  }
   
}
