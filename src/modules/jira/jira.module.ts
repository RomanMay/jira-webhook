import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { GoogleModule } from '../google/google.module';
import { SharedModule } from '../shared/shared.module';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';

@Module({
  imports: [SharedModule, GoogleModule, CoreModule],
  providers: [JiraService],
  exports: [JiraService],
  controllers: [JiraController],
})
export class JiraModule {}
