import { MigrationInterface, QueryRunner } from 'typeorm';

export class RatingAndComment1758020932466 implements MigrationInterface {
  name = 'RatingAndComment1758020932466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD "parent_id" integer`,
    );
    await queryRunner.query(`ALTER TABLE "product_ratings" ADD "comment" text`);
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_a62bd35a869cdd9448865c06071" FOREIGN KEY ("parent_id") REFERENCES "product_ratings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_a62bd35a869cdd9448865c06071"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP COLUMN "comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP COLUMN "parent_id"`,
    );
  }
}
