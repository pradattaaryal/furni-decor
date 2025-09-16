import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

import { DataSource } from 'typeorm';

@Injectable()
export class TriggerRemoveCommand {
  constructor(private readonly dataSource: DataSource) {}

  @Command({
    command: 'remove-trigger:init',
    describe: 'Remove trigger in database',
  })
  async removeTrigger() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // await removeNameTsvTriggers(queryRunner);
      // await removeTicketQuantityTriggers(queryRunner);
      // await removeAttendeesSearchFieldTriggers(queryRunner);
      // await removeEventsRegisterSearchFieldTriggers(queryRunner);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log('Error while removing trigger: ', e);
    } finally {
      await queryRunner.release();
      console.log('Removing Trigger done');
    }
  }
}
