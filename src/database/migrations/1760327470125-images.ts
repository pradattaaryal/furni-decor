import { MigrationInterface, QueryRunner } from 'typeorm';

export class Images1760327470125 implements MigrationInterface {
  name = 'Images1760327470125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" RENAME COLUMN "color" TO "color_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "color_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "color_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_8b91b27dcad5b2bdb13977a176d" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_8b91b27dcad5b2bdb13977a176d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "color_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "color_id" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" RENAME COLUMN "color_id" TO "color"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
