import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMainImageToProducts1760600343643 implements MigrationInterface {
    name = 'AddMainImageToProducts1760600343643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "main_image_id" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_8984eaad3b517d30bbdf01d8057" FOREIGN KEY ("main_image_id") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_8984eaad3b517d30bbdf01d8057"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "main_image_id"`);
    }

}
