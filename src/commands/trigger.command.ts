import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { DataSource } from 'typeorm';

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
      //await addNameTsvTriggers(queryRunner);
      // await addTicketQuantityTriggers(queryRunner); // Ticket Quantity is handled in ticket service
      // await addAttendeesSearchFieldTriggers(queryRunner);
      // await addEventsRegisterSearchFieldTriggers(queryRunner);
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
