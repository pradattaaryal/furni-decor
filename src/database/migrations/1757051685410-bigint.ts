import { MigrationInterface, QueryRunner } from "typeorm";

export class Bigint1757051685410 implements MigrationInterface {
    name = 'Bigint1757051685410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying(100) NOT NULL, "password" text NOT NULL, "verified" boolean NOT NULL DEFAULT false, "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "password_changed_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5661370756cd7553e25cc1a0be" ON "users" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_e1bcae0971273abfb0be1d8834" ON "users" ("id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "otp_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "UserEntity_id" integer NOT NULL, "otp" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_af69f5d9d41ea2100820431b72e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fbecdbd55f912a0d593e357547" ON "otp_entity" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_67864fbd954691fc86cf4e4602" ON "otp_entity" ("id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "otp_entity" ADD CONSTRAINT "FK_ee867e84c4c561254a3c30990e1" FOREIGN KEY ("UserEntity_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp_entity" DROP CONSTRAINT "FK_ee867e84c4c561254a3c30990e1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_67864fbd954691fc86cf4e4602"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbecdbd55f912a0d593e357547"`);
        await queryRunner.query(`DROP TABLE "otp_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1bcae0971273abfb0be1d8834"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5661370756cd7553e25cc1a0be"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
