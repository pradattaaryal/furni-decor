import { MigrationInterface, QueryRunner } from "typeorm";

export class Ordeitemschangesss1758778524301 implements MigrationInterface {
    name = 'Ordeitemschangesss1758778524301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "product_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "dimensions" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "warranty_summary" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "warranty_service_type" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "covered_in_warranty" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "not_covered_in_warranty" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "domestic_warranty" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "domestic_warranty" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "not_covered_in_warranty" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "covered_in_warranty" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "warranty_service_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "warranty_summary" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "dimensions" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "product_name" DROP NOT NULL`);
    }

}
