import { ProductVariantDto } from 'src/modules/product-variants/dto/product-variant.dto';

export interface IProductCreateDto {
  name: string;
  description: string;
  variants?: ProductVariantDto[];

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
}
