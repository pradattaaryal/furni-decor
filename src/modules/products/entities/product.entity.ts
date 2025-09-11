
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { IProductEntity } from '../interfaces/product.entity.interface';

@Entity({ name: 'products' })
export class ProductEntity extends DatabaseBaseEntity implements IProductEntity {
  @ApiProperty({ example: 'Modern Sofa Set' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: 'Comfortable 3-seater sofa with premium fabric' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'description', type: 'varchar', length: 200 })
  description: string;

  @ApiProperty({ example: 1 })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'category_id' })
  categoryId: number;

  @ApiProperty({ example: 'Premium packaging with assembly guide' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'sales_package', type: 'varchar', length: 200, nullable: true })
  salesPackage?: string;

  @ApiProperty({ example: 'Italy' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'origin_of_manufacture', type: 'varchar', length: 30, nullable: true })
  originOfManufacture?: string;

  @ApiProperty({ example: 150.00 })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountValue?: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'discount_start_date', type: 'timestamp', nullable: true })
  discountStartDate?: Date;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'discount_end_date', type: 'timestamp', nullable: true })
  discountEndDate?: Date;

  @ApiProperty({ example: '2 years manufacturer warranty' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'warranty_summary', type: 'text', nullable: true })
  warrantySummary?: string;

  @ApiProperty({ example: 'On-site service' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'warranty_service_type', type: 'text', nullable: true })
  warrantyServiceType?: string;

  @ApiProperty({ example: 'Manufacturing defects, material quality issues' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'covered_in_warranty', type: 'text', nullable: true })
  coveredInWarranty?: string;

  @ApiProperty({ example: 'Normal wear and tear, accidental damage' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'not_covered_in_warranty', type: 'text', nullable: true })
  notCoveredInWarranty?: string;

  @ApiProperty({ example: '2 years domestic warranty' })
  @Expose({ groups: ALL_GROUP })
  @Column({ name: 'domestic_warranty', type: 'text', nullable: true })
  domesticWarranty?: string;

  // Relationships
  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category?: CategoryEntity;
}
