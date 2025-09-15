import { MigrationInterface, QueryRunner } from "typeorm";

export class Otpcascadeonuser1757914193143 implements MigrationInterface {
    name = 'Otpcascadeonuser1757914193143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp_entity" DROP CONSTRAINT "FK_ee867e84c4c561254a3c30990e1"`);
        await queryRunner.query(`ALTER TABLE "otp_entity" ADD CONSTRAINT "FK_ee867e84c4c561254a3c30990e1" FOREIGN KEY ("UserEntity_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp_entity" DROP CONSTRAINT "FK_ee867e84c4c561254a3c30990e1"`);
        await queryRunner.query(`ALTER TABLE "otp_entity" ADD CONSTRAINT "FK_ee867e84c4c561254a3c30990e1" FOREIGN KEY ("UserEntity_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
