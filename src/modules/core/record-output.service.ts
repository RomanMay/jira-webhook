import { Injectable } from '@nestjs/common';
import { Assignee } from '../../common/dto/user-redis-data.dto';

import { GoogleService } from '../google/google.service';

@Injectable()
export class ReportOutput {
  constructor(private readonly googleService: GoogleService) {}

  public async write(assignee: Assignee): Promise<void> {
    await this.googleService.write(assignee);
  }
}
