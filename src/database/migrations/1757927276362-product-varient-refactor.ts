import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductVarientRefactor1757927276362 implements MigrationInterface {
    name = 'ProductVarientRefactor1757927276362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "count" integer`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "image_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "image_id"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "count"`);
    }

}
