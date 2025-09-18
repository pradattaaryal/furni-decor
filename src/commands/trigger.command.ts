import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { DataSource } from 'typeorm';
import { addNameTsvTriggers } from 'src/database/triggers/product-name-tsv.trigger';

@Injectable()
export class TriggerCommand {
  constructor(private readonly dataSource: DataSource) {}

  @Command({
    command: 'trigger:init',
    describe: 'Insert trigger in database',
  })
  async initialTrigger() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await addNameTsvTriggers(queryRunner);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log('Error while inserting trigger: ', e);
    } finally {
      await queryRunner.release();
      console.log('Trigger done');
    }
  }
}
