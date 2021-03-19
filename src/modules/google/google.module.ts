import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { РомаПидарас } from './google.service';

@Module({
  imports: [SharedModule],
  providers: [РомаПидарас],
  exports: [РомаПидарас],
})
export class GoogleModule {}
