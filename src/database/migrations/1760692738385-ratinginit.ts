import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ratinginit1760692738385 implements MigrationInterface {
  name = 'Ratinginit1760692738385';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "averageRating" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "ratingCount" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "ratingCount"`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "averageRating"`,
    );
  }
}
