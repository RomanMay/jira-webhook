import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { GoogleService } from './google.service';

@Module({
  imports: [SharedModule],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
