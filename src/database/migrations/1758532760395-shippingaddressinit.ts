import { MigrationInterface, QueryRunner } from 'typeorm';

export class Shippingaddressinit1758532760395 implements MigrationInterface {
  name = 'Shippingaddressinit1758532760395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "shipping_addresses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "addressLine1" character varying(255) NOT NULL, "addressLine2" character varying(255), "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "postalCode" character varying(20) NOT NULL, "country" character varying(100) NOT NULL, "default" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cced78984eddbbe24470f226692" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6d8288bf6348c9ff32ed28cfe0" ON "shipping_addresses" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff4db4ba69cd1a87a183414538" ON "shipping_addresses" ("id", "created_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "shipping_addresses" ADD CONSTRAINT "FK_75ab21980cabc5be328df3e49cc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_addresses" DROP CONSTRAINT "FK_75ab21980cabc5be328df3e49cc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff4db4ba69cd1a87a183414538"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6d8288bf6348c9ff32ed28cfe0"`,
    );
    await queryRunner.query(`DROP TABLE "shipping_addresses"`);
  }
}
