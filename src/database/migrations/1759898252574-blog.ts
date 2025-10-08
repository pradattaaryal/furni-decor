import { MigrationInterface, QueryRunner } from 'typeorm';

export class Blog1759898252574 implements MigrationInterface {
  name = 'Blog1759898252574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD "slug" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7" UNIQUE ("slug")`,
    );
    await queryRunner.query(`ALTER TABLE "blogs" ADD "name_tsv" tsvector`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "name_tsv"`);
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7"`,
    );
    await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "slug"`);
  }
}
