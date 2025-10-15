import { MigrationInterface, QueryRunner } from 'typeorm';

export class Image1760507425328 implements MigrationInterface {
  name = 'Image1760507425328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "image_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "image_url"`);
  }
}
