import { Module } from '@nestjs/common';

import { DbModule } from '../db/db.module';
import { GoogleModule } from '../google/google.module';
import { SharedModule } from '../shared/shared.module';
import { CoreService } from './core.service';
import { ReportOutput } from './record-output.service';

@Module({
  imports: [SharedModule, GoogleModule, DbModule],
  providers: [CoreService, ReportOutput],
  exports: [CoreService, ReportOutput],
})
export class CoreModule {}
