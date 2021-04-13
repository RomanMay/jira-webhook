import { Injectable } from '@nestjs/common';
import { UserRedisData } from '../../common/dto/user-redis-data.dto';

import { WriteData } from '../../common/dto/write-data.dto';
import { GoogleService } from '../google/google.service';

@Injectable()
export class ReportOutput {
  constructor(private readonly googleService: GoogleService) {}

  public async write(
    record: WriteData,
    userData: UserRedisData,
  ): Promise<void> {
    await this.googleService.write(record, userData);
  }
}
