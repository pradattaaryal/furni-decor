import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

import { DataSource } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from 'src/common/constants/app.constant';
import { seedColors } from 'src/database/seed/color.seed';
import { seedCategories } from 'src/database/seed/product-category.seed';
import { seedUsersWithCarts } from 'src/database/seed/user&cart.seed';
import { seedBlogCategories } from 'src/database/seed/blog-category.seed';
import { seedShippingAddresses } from 'src/database/seed/shipping-address.seed';
import { seedBillingAddresses } from 'src/database/seed/billing-address.seed';
import { seedImages } from 'src/database/seed/image.seed';
import { seedSingleProduct } from 'src/database/seed/product.seed';

@Injectable()
export class SeedCommand {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  @Command({
    command: 'seed:init',
    describe: 'seed database',
  })
  async initialSeed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const env: string = this.configService.get<string>(
        'app.env',
        ENUM_APP_ENVIRONMENT.DEVELOPMENT,
      );
      // await seedRoles(queryRunner);
      // if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
      //   await seedAdmin(queryRunner);
      // }
      await seedCategories(queryRunner);
      await seedBlogCategories(queryRunner);
      await seedColors(queryRunner);
      await seedUsersWithCarts(queryRunner);
      // await seedImages(queryRunner);
      await seedShippingAddresses(queryRunner);
      await seedBillingAddresses(queryRunner);
      // await seedSingleProduct(queryRunner);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log('Error while seeding data: ', e);
    } finally {
      await queryRunner.release();
      console.log('Seeding done');
    }
  }
}
