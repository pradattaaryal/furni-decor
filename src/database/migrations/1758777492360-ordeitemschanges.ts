import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ordeitemschanges1758777492360 implements MigrationInterface {
  name = 'Ordeitemschanges1758777492360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_db2d0ea722e16e0fe8ab3bce111"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "product_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "model" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "dimensions" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "warranty_summary" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "warranty_service_type" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "covered_in_warranty" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "not_covered_in_warranty" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "domestic_warranty" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "product_image_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "UQ_e98ae2ca9cf03e3ce24aa471b0a" UNIQUE ("product_image_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "varient_image_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "UQ_192e8ac226b4a1a8b591757eb6e" UNIQUE ("varient_image_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "quantity" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_e98ae2ca9cf03e3ce24aa471b0a" FOREIGN KEY ("product_image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_192e8ac226b4a1a8b591757eb6e" FOREIGN KEY ("varient_image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_192e8ac226b4a1a8b591757eb6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_e98ae2ca9cf03e3ce24aa471b0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "quantity" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "UQ_192e8ac226b4a1a8b591757eb6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "varient_image_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "UQ_e98ae2ca9cf03e3ce24aa471b0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "product_image_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "domestic_warranty"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "not_covered_in_warranty"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "covered_in_warranty"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "warranty_service_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "warranty_summary"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "dimensions"`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "model"`);
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "product_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_db2d0ea722e16e0fe8ab3bce111" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
