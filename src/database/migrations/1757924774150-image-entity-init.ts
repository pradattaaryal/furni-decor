import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImageEntityInit1757924774150 implements MigrationInterface {
  name = 'ImageEntityInit1757924774150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "path" character varying(255) NOT NULL, "filename" character varying(255) NOT NULL, "mime" character varying(50) NOT NULL, "size" bigint, "type" character varying(100), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf154a48ac328edeb8167a1cd7" ON "image" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d66031207bb97bfd6fc53e8f57" ON "image" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_643e806cfd148c15e5d5982da7" ON "image" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dfac6399a9b7b8134c350af0b9" ON "image" ("type", "deleted_at") WHERE type = 'product_variants' AND deleted_at IS NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "image_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_b1aae736b7c5d6925efa8563527" UNIQUE ("image_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b1aae736b7c5d6925efa8563527" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b1aae736b7c5d6925efa8563527"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_b1aae736b7c5d6925efa8563527"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "image_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dfac6399a9b7b8134c350af0b9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_643e806cfd148c15e5d5982da7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d66031207bb97bfd6fc53e8f57"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf154a48ac328edeb8167a1cd7"`,
    );
    await queryRunner.query(`DROP TABLE "image"`);
  }
}
