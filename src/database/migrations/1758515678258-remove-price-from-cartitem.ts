import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePriceFromCartitem1758515678258
  implements MigrationInterface
{
  name = 'RemovePriceFromCartitem1758515678258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "price"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD "price" numeric(10,2) NOT NULL`,
    );
  }
}
