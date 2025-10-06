import { MigrationInterface, QueryRunner } from "typeorm";

export class Wishlistsssh1759742236213 implements MigrationInterface {
    name = 'Wishlistsssh1759742236213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlists" DROP COLUMN "cdscs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlists" ADD "cdscs" integer NOT NULL`);
    }

}
