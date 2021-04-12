import { Module } from '@nestjs/common';
import { GoogleModule } from '../google/google.module';
import { JiraModule } from '../jira/jira.module';
import { SharedModule } from '../shared/shared.module';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { ReportOutput } from './record-output.service';

@Module({
  imports: [SharedModule, GoogleModule, JiraModule],
  providers: [CoreService, ReportOutput],
  exports: [CoreService, ReportOutput],
  controllers: [CoreController],
})
export class CoreModule {}
