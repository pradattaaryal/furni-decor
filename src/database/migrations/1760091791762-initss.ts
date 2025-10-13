import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initss1760091791762 implements MigrationInterface {
  name = 'Initss1760091791762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "colors" DROP CONSTRAINT "UQ_cf12321fa0b7b9539e89c7dfeb7"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "colors" ADD CONSTRAINT "UQ_cf12321fa0b7b9539e89c7dfeb7" UNIQUE ("name")`,
    );
  }
}
