import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { ProductVariantEntity } from 'src/modules/product-variants/entities/product-variant.entity';

export interface IProductEntity extends DatabaseBaseEntity {
  name: string;
  description: string;
  categoryId: number;
  price?: number;
  // ================= Additional Product Specifications Start =================
  modelNumber?: string;
  secondaryMaterial?: string;
  configuration?: string;
  upholsteryMaterial?: string;
  upholsteryColor?: string;
  fillingMaterial?: string;
  finishType?: string;
  adjustableHeadrest?: boolean;
  maxLoad?: string;
  // ================= Additional Product Specifications End =================

  salesPackage?: string;
  originOfManufacture?: string;
  discountValue?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
  warrantySummary?: string;
  warrantyServiceType?: string;
  coveredInWarranty?: string;
  notCoveredInWarranty?: string;
  domesticWarranty?: string;

  // Relations
  category?: CategoryEntity;
  variants?: ProductVariantEntity[];
  images?: ImageEntity[];
}
