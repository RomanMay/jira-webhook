import { Injectable } from '@nestjs/common';

import { WriteData } from '../../common/dto/write-data.dto';
import { GoogleService } from '../google/google.service';

@Injectable()
export class ReportOutput {
  constructor(private readonly googleService: GoogleService) {}

  public async write(record: WriteData, workLog: any): Promise<void> {
    await this.googleService.write(record, workLog);
  }
}
