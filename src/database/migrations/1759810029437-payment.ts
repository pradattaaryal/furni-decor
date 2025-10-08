import { MigrationInterface, QueryRunner } from 'typeorm';

export class Payment1759810029437 implements MigrationInterface {
  name = 'Payment1759810029437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "providerPaymentIntentId"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "orderId"`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "providerPaymentId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "failureReason" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "currency"`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "currency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."payments_status_enum" RENAME TO "payments_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum" USING "status"::"text"::"public"."payments_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."payments_provider_enum" RENAME TO "payments_provider_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_provider_enum" AS ENUM('stripe', 'paypal', 'square')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "provider" TYPE "public"."payments_provider_enum" USING "provider"::"text"::"public"."payments_provider_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."payments_provider_enum_old"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "payments" ADD "metadata" jsonb`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "payments" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "payments" ADD "metadata" json`);
    await queryRunner.query(
      `CREATE TYPE "public"."payments_provider_enum_old" AS ENUM('stripe', 'paypal')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "provider" TYPE "public"."payments_provider_enum_old" USING "provider"::"text"::"public"."payments_provider_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."payments_provider_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."payments_provider_enum_old" RENAME TO "payments_provider_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum_old" AS ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum_old" USING "status"::"text"::"public"."payments_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."payments_status_enum_old" RENAME TO "payments_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "currency"`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "currency" character varying(3) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "failureReason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "providerPaymentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "orderId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "providerPaymentIntentId" character varying`,
    );
  }
}
