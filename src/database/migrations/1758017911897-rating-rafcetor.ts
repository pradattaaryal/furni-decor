import { MigrationInterface, QueryRunner } from "typeorm";

export class RatingRafcetor1758017911897 implements MigrationInterface {
    name = 'RatingRafcetor1758017911897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_ratings" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "is_approved" boolean NOT NULL DEFAULT false, "rating" smallint NOT NULL, "product_id" integer, "user_id" integer, CONSTRAINT "PK_f8bd94404fc1d160bdb075dc435" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5eb1494ab71a00077f356139d8" ON "product_ratings" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ead0d94806e06b003b89f6ad77" ON "product_ratings" ("id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "product_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_538c9489e98d4874e8db0c4cafd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_25a422fb6e1a8999db0d4854621" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_25a422fb6e1a8999db0d4854621"`);
        await queryRunner.query(`ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_538c9489e98d4874e8db0c4cafd"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "product_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ead0d94806e06b003b89f6ad77"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5eb1494ab71a00077f356139d8"`);
        await queryRunner.query(`DROP TABLE "product_ratings"`);
    }

}
