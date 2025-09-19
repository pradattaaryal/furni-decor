import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './services/cart.service';
import { CartRepositoryModule } from './repositories/cart.repository.module';
import { CartEntity } from './entities/cart.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    CartRepositoryModule,
    TypeOrmModule.forFeature([CartEntity]),
    forwardRef(() => UserModule),
  ],
  providers: [CartService],
  exports: [CartService],
  controllers: [],
})
export class CartModule {}
