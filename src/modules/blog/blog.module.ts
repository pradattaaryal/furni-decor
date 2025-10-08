import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryModule } from '../user/repositories/user.repostory.module';
import { CartModule } from '../cart/cart.module';
import { BlogEntity } from './entities/blog.entity';
import { BlogRepository } from './repositories/blog.repository';
import { BlogService } from './services/blog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
    UserRepositoryModule,
    forwardRef(() => CartModule),
  ],
  providers: [BlogService, BlogRepository],
  exports: [BlogService, BlogRepository],
})
export class BlogModule {}
