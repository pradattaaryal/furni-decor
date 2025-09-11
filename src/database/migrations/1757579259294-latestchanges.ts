import { MigrationInterface, QueryRunner } from "typeorm";

export class Latestchanges1757579259294 implements MigrationInterface {
    name = 'Latestchanges1757579259294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'marketing', 'customer')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying(100) NOT NULL, "password" text NOT NULL, "verified" boolean NOT NULL DEFAULT false, "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "password_changed_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5661370756cd7553e25cc1a0be" ON "users" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_e1bcae0971273abfb0be1d8834" ON "users" ("id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "otp_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "UserEntity_id" integer NOT NULL, "otp" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_af69f5d9d41ea2100820431b72e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fbecdbd55f912a0d593e357547" ON "otp_entity" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_67864fbd954691fc86cf4e4602" ON "otp_entity" ("id", "created_at") `);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "parent_id" integer, "slug" character varying(255) NOT NULL, "description" text, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1416a7fb33c4bc1167c5b06115" ON "categories" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_803808891b6e8128e40ed75b7f" ON "categories" ("id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_1084464054fa259ee8a0279b60" ON "categories" ("name", "parent_id") `);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, "description" character varying(200) NOT NULL, "category_id" integer NOT NULL, "sales_package" character varying(200), "origin_of_manufacture" character varying(30), "discount_value" numeric(10,2), "discount_start_date" TIMESTAMP, "discount_end_date" TIMESTAMP, "warranty_summary" text, "warranty_service_type" text, "covered_in_warranty" text, "not_covered_in_warranty" text, "domestic_warranty" text, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_490cf2092412d5647d15316c9f" ON "products" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_f534c8d1c88f519e8865c450fb" ON "products" ("id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "otp_entity" ADD CONSTRAINT "FK_ee867e84c4c561254a3c30990e1" FOREIGN KEY ("UserEntity_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`);
        await queryRunner.query(`ALTER TABLE "otp_entity" DROP CONSTRAINT "FK_ee867e84c4c561254a3c30990e1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f534c8d1c88f519e8865c450fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_490cf2092412d5647d15316c9f"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1084464054fa259ee8a0279b60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_803808891b6e8128e40ed75b7f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1416a7fb33c4bc1167c5b06115"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_67864fbd954691fc86cf4e4602"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbecdbd55f912a0d593e357547"`);
        await queryRunner.query(`DROP TABLE "otp_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1bcae0971273abfb0be1d8834"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5661370756cd7553e25cc1a0be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
