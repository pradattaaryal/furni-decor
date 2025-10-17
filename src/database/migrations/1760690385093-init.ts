import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1760690385093 implements MigrationInterface {
  name = 'Init1760690385093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_a62bd35a869cdd9448865c06071"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP COLUMN "is_approved"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP COLUMN "parent_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP COLUMN "comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "product_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_538c9489e98d4874e8db0c4cafd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_25a422fb6e1a8999db0d4854621"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ALTER COLUMN "product_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP COLUMN "rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD "rating" integer`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "product_ratings"."rating" IS 'Rating value from 1 to 5'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_728920c8530e2d53c70ae1f695" ON "product_ratings" ("product_id", "user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "unique_user_product_rating" UNIQUE ("product_id", "user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_538c9489e98d4874e8db0c4cafd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_25a422fb6e1a8999db0d4854621" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_25a422fb6e1a8999db0d4854621"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_538c9489e98d4874e8db0c4cafd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "unique_user_product_rating"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_728920c8530e2d53c70ae1f695"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "product_ratings"."rating" IS 'Rating value from 1 to 5'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP COLUMN "rating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD "rating" smallint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ALTER COLUMN "product_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_25a422fb6e1a8999db0d4854621" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_538c9489e98d4874e8db0c4cafd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "product_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "product_ratings" ADD "comment" text`);
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD "parent_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD "is_approved" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_a62bd35a869cdd9448865c06071" FOREIGN KEY ("parent_id") REFERENCES "product_ratings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
