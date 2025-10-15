import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductFeature1760506198487 implements MigrationInterface {
  name = 'ProductFeature1760506198487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "featured" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "featured"`);
  }
}
