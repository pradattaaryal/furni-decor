import { MigrationInterface, QueryRunner } from 'typeorm';

export class Imageraltion41759917254354 implements MigrationInterface {
  name = 'Imageraltion41759917254354';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_e98ae2ca9cf03e3ce24aa471b0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_192e8ac226b4a1a8b591757eb6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "REL_e98ae2ca9cf03e3ce24aa471b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "REL_192e8ac226b4a1a8b591757eb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_e98ae2ca9cf03e3ce24aa471b0a" FOREIGN KEY ("product_image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_192e8ac226b4a1a8b591757eb6e" FOREIGN KEY ("varient_image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_192e8ac226b4a1a8b591757eb6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_e98ae2ca9cf03e3ce24aa471b0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "REL_192e8ac226b4a1a8b591757eb6" UNIQUE ("varient_image_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "REL_e98ae2ca9cf03e3ce24aa471b0" UNIQUE ("product_image_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_192e8ac226b4a1a8b591757eb6e" FOREIGN KEY ("varient_image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_e98ae2ca9cf03e3ce24aa471b0a" FOREIGN KEY ("product_image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
