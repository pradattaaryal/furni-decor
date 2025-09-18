import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductNameTsv1758108392459 implements MigrationInterface {
    name = 'ProductNameTsv1758108392459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "name_tsv" tsvector`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "name_tsv"`);
    }

}
