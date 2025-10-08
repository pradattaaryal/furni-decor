import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wishlistsss1759742082717 implements MigrationInterface {
  name = 'Wishlistsss1759742082717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD "cdscs" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wishlists" DROP COLUMN "cdscs"`);
  }
}
