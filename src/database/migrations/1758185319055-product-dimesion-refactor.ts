import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductDimesionRefactor1758185319055 implements MigrationInterface {
    name = 'ProductDimesionRefactor1758185319055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" RENAME COLUMN "count" TO "quantity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" RENAME COLUMN "quantity" TO "count"`);
    }

}
