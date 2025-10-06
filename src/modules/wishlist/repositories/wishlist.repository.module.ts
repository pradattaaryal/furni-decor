import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from '../entities/wishlist.entity';
import { WishlistRepository } from './wishlist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistEntity])],
  providers: [WishlistRepository],
  exports: [WishlistRepository],
})
export class WishlistRepositoryModule {}
