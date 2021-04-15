import { Module } from '@nestjs/common';
import { GoogleModule } from '../google/google.module';
import { SharedModule } from '../shared/shared.module';
import { CoreService } from './core.service';
import { ReportOutput } from './record-output.service';

@Module({
  imports: [SharedModule, GoogleModule],
  providers: [CoreService, ReportOutput],
  exports: [CoreService, ReportOutput],
})
export class CoreModule {}
