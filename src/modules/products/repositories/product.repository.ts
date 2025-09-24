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
    console.log(createProductDto);
    const product = this.productRepo.create({
      ...createProductDto,
      images: createProductDto.images.map((imageId) => ({ id: imageId })),
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

  async fetchProductByName(name: string): Promise<ProductEntity[]> {
    return await this.productRepo
      .createQueryBuilder('product')
      .where('product.name ILIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async fetchProduct(id: number): Promise<ProductEntity | null> {
    return await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id = :id', { id })
      .getOne();
  }

  async updateProduct(
    id: number,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity | null> {
    await this.productRepo.update(id, data);
    return await this.fetchProduct(id);
  }

  async getProductsByCategory(categoryId: number): Promise<ProductEntity[]> {
    return await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.categoryId = :categoryId', { categoryId })
      .getMany();
  }
}
