import { Injectable } from '@nestjs/common';
import { WriteData } from '../../common/dto/write-data.dto';
import { JiraService } from '../jira/jira.service';
import { ReportOutput } from './record-output.service';

@Injectable()
export class CoreService {
  constructor(
    private readonly jiraService: JiraService,
    private readonly recordOutput: ReportOutput,
  ) {}
  public async handleNewRecord(workLog: any): Promise<void> {
    const issue = await this.jiraService.findIssue(workLog.issueId);
    // console.log('issue:', issue)

    const record = new WriteData(workLog, issue);
    console.log('record:', record);

    await this.recordOutput.write(record, workLog);
  }
}
