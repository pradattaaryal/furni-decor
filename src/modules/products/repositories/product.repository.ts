import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductCreateDto } from '../dto/product.create.dto';
import slugify from 'slugify';

@Injectable()
export class ProductRepository extends BaseRepository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {
    super(productRepo);
  }
  async createProduct(createProductDto: ProductCreateDto) {
    const product = this.productRepo.create({
      ...createProductDto,
      images: createProductDto.images.map((imageId) => ({ id: imageId })),
      mainImage: createProductDto.mainImageId
        ? { id: createProductDto.mainImageId }
        : undefined,
    });
    await this.productRepo.save(product);
    const productSlug = slugify(`${product.name}-${product.id}`, {
      lower: true,
      strict: true,
      replacement: '-',
    });
    product.slug = productSlug;
    await this.productRepo.save(product);
    return product;
  }

  getRepo(): Repository<ProductEntity> {
    return this.productRepo;
  }
}
