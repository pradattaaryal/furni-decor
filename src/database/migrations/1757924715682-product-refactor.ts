import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductRefactor1757924715682 implements MigrationInterface {
    name = 'ProductRefactor1757924715682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "model_number" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "secondary_material" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "configuration" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "upholstery_material" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "upholstery_color" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "filling_material" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "finish_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "adjustable_headrest" boolean`);
        await queryRunner.query(`ALTER TABLE "products" ADD "max_load" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "max_load"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "adjustable_headrest"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "finish_type"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "filling_material"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "upholstery_color"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "upholstery_material"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "configuration"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "secondary_material"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "model_number"`);
    }

}
