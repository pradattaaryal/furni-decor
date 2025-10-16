import { ProductVariantDto } from 'src/modules/product-variants/dto/product-variant.dto';

export class ImageResponseDto {
  id: number;
  path: string;
  filename: string;
  mime:string
}

export class ProductResponseDto {
  id: number;
  name: string;
  slug: string;
  tag: string;
  description?: string;
  price?: number;
  quantity?: number;
  additionalData?: {
    dimensions: Record<string, number>;

    general?: {
      salesPackage?: string;
      model?: string;
      secondaryMaterial?: string;
      configuration?: string;
      upholsteryMaterial?: string;
      upholsteryColor?: string;
    };

    product?: {
      fillingMaterial?: string;
      finishType?: string;
      adjustableHeadrest?: boolean;
      maxLoad?: number;
      originOfManufacture?: string;
    };

    dimension?: Record<string, any>;

    warranty?: {
      warrantySummary?: string;
      warrantyServiceType?: string;
      coveredInWarranty?: string;
      notCoveredInWarranty?: string;
      domesticWarranty?: string;
    };
  };
  variants?: ProductVariantDto[];
  images?: ImageResponseDto[];
  mainImage?: ImageResponseDto;
  category?: any;
}
