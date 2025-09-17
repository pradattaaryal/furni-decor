import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pricechange1758101706465 implements MigrationInterface {
  name = 'Pricechange1758101706465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "price"`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "price" numeric(10,2)`);
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
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "price" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
