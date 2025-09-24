import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Index,
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
} from 'typeorm';
import { IProductEntity } from '../interfaces/product.entity.interface';
import { ProductVariantEntity } from 'src/modules/product-variants/entities/product-variant.entity';
import { ProductRatingEntity } from 'src/modules/product-rating/entities/product-rating.entity';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import slugify from 'slugify';

@Entity({ name: 'products' })
export class ProductEntity
  extends DatabaseBaseEntity
  implements IProductEntity
{
  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 200 })
  description: string;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({
    name: 'model_number',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  modelNumber?: string;

  @Column({
    name: 'secondary_material',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  secondaryMaterial?: string;

  @Column({
    name: 'configuration',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  configuration?: string;

  @Column({
    name: 'upholstery_material',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  upholsteryMaterial?: string;

  @Column({
    name: 'upholstery_color',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  upholsteryColor?: string;

  @Column({
    name: 'filling_material',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  fillingMaterial?: string;

  @Column({ name: 'finish_type', type: 'varchar', length: 50, nullable: true })
  finishType?: string;

  @Column({ name: 'adjustable_headrest', type: 'boolean', nullable: true })
  adjustableHeadrest?: boolean;
  @Column({ name: 'max_load', type: 'int', nullable: true })
  maxLoad?: number;

  // ================= Additional Product Specifications End =================

  @Column({
    name: 'sales_package',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  salesPackage?: string;

  @Column({
    name: 'origin_of_manufacture',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  originOfManufacture?: string;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  discountValue?: number;

  @Column({ name: 'discount_start_date', type: 'timestamp', nullable: true })
  discountStartDate?: Date;

  @Column({ name: 'discount_end_date', type: 'timestamp', nullable: true })
  discountEndDate?: Date;

  @Column({ name: 'warranty_summary', type: 'text', nullable: true })
  warrantySummary?: string;

  @Column({ name: 'warranty_service_type', type: 'text', nullable: true })
  warrantyServiceType?: string;

  @Column({ name: 'covered_in_warranty', type: 'text', nullable: true })
  coveredInWarranty?: string;

  @Column({ name: 'not_covered_in_warranty', type: 'text', nullable: true })
  notCoveredInWarranty?: string;

  @Column({ name: 'domestic_warranty', type: 'text', nullable: true })
  domesticWarranty?: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  slug: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  price: number;
  @OneToMany(() => ImageEntity, (image) => image.product)
  images?: ImageEntity[];

  //search by product name
  @Column({
    name: 'name_tsv',
    type: 'tsvector',
    nullable: true,
  })
  @Index('event_name_tsv_idx', { synchronize: false })
  nameTsv: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => ProductVariantEntity, (variant) => variant.product, {
    createForeignKeyConstraints: false,
  })
  variants: ProductVariantEntity[];

  @OneToMany(() => ProductRatingEntity, (rating) => rating.product)
  ratings: ProductRatingEntity[];

  // @AfterInsert()
  // async generateSlug(): Promise<void> {
  //   if (!this.name) return;

  //   const slug = slugify(`${this.name}-${this.id}`, {
  //     lower: true,
  //     strict: true,
  //     replacement: '-'
  //   });

  //   this.slug=slug

  //   return
  // }
}
