import { MigrationInterface, QueryRunner } from "typeorm";

export class Dimesion1758875102344 implements MigrationInterface {
    name = 'Dimesion1758875102344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_provider_enum" AS ENUM('stripe', 'paypal')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "amount" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "provider" "public"."payments_provider_enum" NOT NULL, "providerTransactionId" character varying, "providerPaymentIntentId" character varying, "metadata" json, "description" text, "userId" character varying, "orderId" character varying, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c612dfd77dea74aae0d2e54526" ON "payments" ("id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_d1b60aeebff2214f42e6fa5f38" ON "payments" ("id", "created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d1b60aeebff2214f42e6fa5f38"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c612dfd77dea74aae0d2e54526"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    }

}
