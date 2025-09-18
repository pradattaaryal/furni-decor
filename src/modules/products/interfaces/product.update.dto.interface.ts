import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { ProductVariantDto } from 'src/modules/product-variants/dto/product-variant.dto';

export interface IProductUpdateDto {
   name?: string;
    description?: string;
    variants?: ProductVariantDto[];
    price?: number;
    modelNumber?: string;
    secondaryMaterial?: string;
    configuration?: string;
    upholsteryMaterial?: string;
    upholsteryColor?: string;
    fillingMaterial?: string;
    finishType?: string;
    adjustableHeadrest?: boolean;
    maxLoad?: number;
    categoryId?: number;
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
    images?: number[];
}
