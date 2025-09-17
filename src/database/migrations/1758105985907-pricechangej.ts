import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pricechangej1758105985907 implements MigrationInterface {
  name = 'Pricechangej1758105985907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image" ADD "product_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_e6a9e829e17fc47fc17d695af8e" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_e6a9e829e17fc47fc17d695af8e"`,
    );
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "product_id"`);
  }
}
