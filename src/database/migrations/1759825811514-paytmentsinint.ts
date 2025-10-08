import { MigrationInterface, QueryRunner } from 'typeorm';

export class Paytmentsinint1759825811514 implements MigrationInterface {
  name = 'Paytmentsinint1759825811514';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "userId" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "userId" character varying NOT NULL`,
    );
  }
}
