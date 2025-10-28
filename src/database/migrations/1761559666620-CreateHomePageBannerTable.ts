import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHomePageBannerTable1761559666620
  implements MigrationInterface
{
  name = 'CreateHomePageBannerTable1761559666620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "home_page_banners" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying(255) NOT NULL, "description" text, "image_id" integer NOT NULL, "link" character varying(500), "order_index" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_dc155a437562009f7636e0a9ade" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7fdef98c2632baeed98f5bd369" ON "home_page_banners" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2ecb793b70ca4571419600f368" ON "home_page_banners" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4548f3927b30f1aeff64216a2a" ON "home_page_banners" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_060740d165089c006a302e6ec7" ON "home_page_banners" ("order_index") `,
    );
    await queryRunner.query(
      `ALTER TABLE "home_page_banners" ADD CONSTRAINT "FK_d76d6d653f01626dbd7d46eb55a" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "home_page_banners" DROP CONSTRAINT "FK_d76d6d653f01626dbd7d46eb55a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_060740d165089c006a302e6ec7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4548f3927b30f1aeff64216a2a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2ecb793b70ca4571419600f368"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7fdef98c2632baeed98f5bd369"`,
    );
    await queryRunner.query(`DROP TABLE "home_page_banners"`);
  }
}
