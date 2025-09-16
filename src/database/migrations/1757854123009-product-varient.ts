import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductVarient1757854123009 implements MigrationInterface {
  name = 'ProductVarient1757854123009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_variants" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "dimensions" jsonb NOT NULL, "color" character varying(20) NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_155c01468f41e508b5db2c5de1" ON "product_variants" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eaad245682e9f8a3eb0f030e1b" ON "product_variants" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_281e3f2c55652d6a22c0aa59fd" ON "product_variants" ("id") `,
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
      `DROP INDEX "public"."IDX_281e3f2c55652d6a22c0aa59fd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eaad245682e9f8a3eb0f030e1b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_155c01468f41e508b5db2c5de1"`,
    );
    await queryRunner.query(`DROP TABLE "product_variants"`);
  }
}
