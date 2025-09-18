import { MigrationInterface, QueryRunner } from "typeorm";

export class Discount1758187235232 implements MigrationInterface {
    name = 'Discount1758187235232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "discount_value" TO "discountValue"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "discountValue" TO "discount_value"`);
    }

}
