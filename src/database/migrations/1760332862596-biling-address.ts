import { MigrationInterface, QueryRunner } from "typeorm";

export class BilingAddress1760332862596 implements MigrationInterface {
    name = 'BilingAddress1760332862596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "billing_addresses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "phoneNumber" character varying(20) NOT NULL, "address" character varying(255) NOT NULL, "city" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "streetAddress1" character varying(255) NOT NULL, "streetAddress2" character varying(255), "zipCode" character varying(20) NOT NULL, "default" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_494b6f363341324138270070b6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_384cc5ac80d2c9b1c901dcdcb8" ON "billing_addresses" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_5e2bceb10cd1a9a21a85b39281" ON "billing_addresses" ("id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "billing_addresses" ADD CONSTRAINT "FK_2072c5b1b9dbb62e33d21889f54" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_d5bda805951a38147cb93726a77" FOREIGN KEY ("billing_address_id") REFERENCES "billing_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_d5bda805951a38147cb93726a77"`);
        await queryRunner.query(`ALTER TABLE "billing_addresses" DROP CONSTRAINT "FK_2072c5b1b9dbb62e33d21889f54"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e2bceb10cd1a9a21a85b39281"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_384cc5ac80d2c9b1c901dcdcb8"`);
        await queryRunner.query(`DROP TABLE "billing_addresses"`);
    }

}
