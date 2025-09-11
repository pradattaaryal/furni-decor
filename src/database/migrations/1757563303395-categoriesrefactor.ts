import { MigrationInterface, QueryRunner } from "typeorm";

export class Categoriesrefactor1757563303395 implements MigrationInterface {
    name = 'Categoriesrefactor1757563303395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "parent_id" integer, "slug" character varying(255) NOT NULL, "description" text, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1416a7fb33c4bc1167c5b06115" ON "categories" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_803808891b6e8128e40ed75b7f" ON "categories" ("id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_1084464054fa259ee8a0279b60" ON "categories" ("name", "parent_id") `);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1084464054fa259ee8a0279b60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_803808891b6e8128e40ed75b7f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1416a7fb33c4bc1167c5b06115"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
