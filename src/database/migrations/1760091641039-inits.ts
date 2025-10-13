import { MigrationInterface, QueryRunner } from 'typeorm';

export class Inits1760091641039 implements MigrationInterface {
  name = 'Inits1760091641039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "colors" DROP CONSTRAINT "UQ_ba32257c064779ed6afad3f9946"`,
    );
    await queryRunner.query(`ALTER TABLE "colors" DROP COLUMN "slug"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "colors" ADD "slug" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "colors" ADD CONSTRAINT "UQ_ba32257c064779ed6afad3f9946" UNIQUE ("slug")`,
    );
  }
}
