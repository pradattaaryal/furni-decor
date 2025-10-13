import { MigrationInterface, QueryRunner } from 'typeorm';

export class VarientWishlistRelation1760328820791
  implements MigrationInterface
{
  name = 'VarientWishlistRelation1760328820791';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wishlists" ADD "variant_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD CONSTRAINT "FK_cfcd97a9f1a9f6c9595e850ee9e" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlists" DROP CONSTRAINT "FK_cfcd97a9f1a9f6c9595e850ee9e"`,
    );
    await queryRunner.query(`ALTER TABLE "wishlists" DROP COLUMN "variant_id"`);
  }
}
