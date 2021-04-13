import { Injectable } from '@nestjs/common';
import { Assignee, UserRedisData1 } from '../../common/dto/user-redis-data.dto';

import { WriteData } from '../../common/dto/write-data.dto';
import { UserSheetsIndexes } from '../../common/types/user-sheets-indexes.type';
import { GoogleService } from '../google/google.service';

@Injectable()
export class ReportOutput {
  constructor(private readonly googleService: GoogleService) {}

  public async write(assignee: Assignee): Promise<void> {
    await this.googleService.write(assignee);
  }
}
