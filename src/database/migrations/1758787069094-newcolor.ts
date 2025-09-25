import { MigrationInterface, QueryRunner } from "typeorm";

export class Newcolor1758787069094 implements MigrationInterface {
    name = 'Newcolor1758787069094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ADD "product_color" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "product_color"`);
    }

}
