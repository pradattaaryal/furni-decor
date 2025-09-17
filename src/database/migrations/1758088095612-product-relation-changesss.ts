import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductRelationChangesss1758088095612
  implements MigrationInterface
{
  name = 'ProductRelationChangesss1758088095612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "image_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "UQ_80810e665ba660ed25412c5b8a6" UNIQUE ("image_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_80810e665ba660ed25412c5b8a6" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_80810e665ba660ed25412c5b8a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "UQ_80810e665ba660ed25412c5b8a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "image_id"`,
    );
  }
}
