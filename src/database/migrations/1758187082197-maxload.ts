import { MigrationInterface, QueryRunner } from "typeorm";

export class Maxload1758187082197 implements MigrationInterface {
    name = 'Maxload1758187082197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "max_load"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "max_load" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "max_load"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "max_load" character varying(50)`);
    }

}
