import { CategoryEntity } from 'src/modules/category/entities/category.entity';

export interface IProductEntity {
  name: string;
  description: string;
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
  category?: CategoryEntity;
}
