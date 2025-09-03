import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1756870875416 implements MigrationInterface {
    name = 'Init1756870875416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying(100), "password" text NOT NULL, "role" character varying(220) NOT NULL, "password_changed_at" TIMESTAMP WITH TIME ZONE NOT NULL, "first_name" character varying, "last_name" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5661370756cd7553e25cc1a0be" ON "users" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_e1bcae0971273abfb0be1d8834" ON "users" ("id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1bcae0971273abfb0be1d8834"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5661370756cd7553e25cc1a0be"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
