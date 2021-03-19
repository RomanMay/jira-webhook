import { Module } from '@nestjs/common';
import { GoogleModule } from './modules/google/google.module';
import { JiraModule } from './modules/jira/jira.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [JiraModule, GoogleModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
