import { MigrationInterface, QueryRunner } from "typeorm";

export class Ordeitemschangess1758777981658 implements MigrationInterface {
    name = 'Ordeitemschangess1758777981658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "product_name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "product_name" SET NOT NULL`);
    }

}
