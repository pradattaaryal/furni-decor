import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepo: Repository<UserEntity>,
  ) {
    super(_userRepo);
  }

  async findOneWithPasswordByEmail(email: string): Promise<UserEntity | null> {
    const qb = this._getQueryBuilder('user');
    return await qb
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }
}
