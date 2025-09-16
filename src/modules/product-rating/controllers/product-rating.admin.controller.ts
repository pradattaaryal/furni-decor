/*import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiDocs } from "src/common/doc/common-docs";

 

@ApiTags('Product Rating')
@Controller('product-rating')
export class ProductRatingAdminController {
  constructor(private readonly productRatingService: ProductRatingService) {}

  @Post('/create')
  @ApiDocs({ operation: 'Create Product Rating' })
  async create(@Body() body: ProductRatingCreateDto): Promise<IResponse<{ category: ProductRatingEntity; message: string }>> {
    // Validate parent_id only if it is present (not undefined or null)
 
    return {
      data: {
        category,
        message: 'ProductRating created successfully.',
      },
    };
  }
 
   
 
 
}*/