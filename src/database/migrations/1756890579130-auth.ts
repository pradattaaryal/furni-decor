import { MigrationInterface, QueryRunner } from "typeorm";

export class Auth1756890579130 implements MigrationInterface {
    name = 'Auth1756890579130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "otp_entity" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "UserEntity_id" bigint NOT NULL, "otp" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_af69f5d9d41ea2100820431b72e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fbecdbd55f912a0d593e357547" ON "otp_entity" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_67864fbd954691fc86cf4e4602" ON "otp_entity" ("id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'marketing', 'customer')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_entity" ADD CONSTRAINT "FK_ee867e84c4c561254a3c30990e1" FOREIGN KEY ("UserEntity_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp_entity" DROP CONSTRAINT "FK_ee867e84c4c561254a3c30990e1"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "first_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying(220)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verified"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_67864fbd954691fc86cf4e4602"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbecdbd55f912a0d593e357547"`);
        await queryRunner.query(`DROP TABLE "otp_entity"`);
    }

}
