import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerstripeId1760068997611 implements MigrationInterface {
  name = 'CustomerstripeId1760068997611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "blog_categories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text, CONSTRAINT "UQ_adc3bc773ccf2fb6f073193fcf6" UNIQUE ("name"), CONSTRAINT "UQ_903a6ea496e83ba9bec10af5835" UNIQUE ("slug"), CONSTRAINT "PK_1056d6faca26b9957f5d26e6572" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a176b739100e057522a10e36e0" ON "blog_categories" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2c324bc456e89e48f9f2464d85" ON "blog_categories" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adc3bc773ccf2fb6f073193fcf" ON "blog_categories" ("name") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "stripe_customer_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "stripe_customer_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_adc3bc773ccf2fb6f073193fcf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c324bc456e89e48f9f2464d85"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a176b739100e057522a10e36e0"`,
    );
    await queryRunner.query(`DROP TABLE "blog_categories"`);
  }
}
