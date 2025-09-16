import { Global, Module } from '@nestjs/common';
import { HelperFileService } from './services/helper.file.service';
import { HelperDateService } from './services/helper.date.service';
import { HelperNumberService } from './services/helper.number.service';
import { TSQueryHelperService } from './services/helper.tsquery.service';

@Global()
@Module({
  providers: [
    HelperFileService,
    HelperDateService,
    HelperNumberService,
    TSQueryHelperService,
  ],
  exports: [
    HelperFileService,
    HelperDateService,
    HelperNumberService,
    TSQueryHelperService,
  ],
})
export class HelperModule {}
