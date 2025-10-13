import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { ProductVariantCreateDto } from 'src/modules/product-variants/dto/product-variant.create.dto';
import { ProductVariantDto } from 'src/modules/product-variants/dto/product-variant.dto';

export interface IProductCreateDto {
  name: string;
  description: string;
  quantity: number;
  variants?: ProductVariantDto[];
  price?: number;
  dimensions?: Record<string, number>;
  modelNumber?: string;
  secondaryMaterial?: string;
  configuration?: string;
  upholsteryMaterial?: string;
  upholsteryColor?: string;
  fillingMaterial?: string;
  finishType?: string;
  adjustableHeadrest?: boolean;
  maxLoad?: number;
  categoryId: number;
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
  images: number[];
}
