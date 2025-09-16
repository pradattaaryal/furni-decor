import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

import { DataSource } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from 'src/common/constants/app.constant';

@Injectable()
export class SeedCommand {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  @Command({
    command: 'seed:init',
    describe: 'seed database',
  })
  async initialSeed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const env: string = this.configService.get<string>(
        'app.env',
        ENUM_APP_ENVIRONMENT.DEVELOPMENT,
      );
      // await seedRoles(queryRunner);
      // if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
      //   await seedAdmin(queryRunner);
      // }
      // await seedBranch(queryRunner);
      // await seedCountry(queryRunner);
      // await seedState(queryRunner);
      // await seedModules(queryRunner);
      // await seedLanguages(queryRunner);
      // await seedRolePermissions(queryRunner);
      // await seedTicketTypes(queryRunner);
      // await seedAppSettings(queryRunner);
      // await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log('Error while seeding data: ', e);
    } finally {
      await queryRunner.release();
      console.log('Seeding done');
    }
  }
}
