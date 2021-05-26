import { Body, Controller, Post } from '@nestjs/common';
import { Assignee } from '../../common/dto/user-redis-data.dto';
import { CoreService } from '../core/core.service';
import { JiraService } from './jira.service';

@Controller('webhook')
export class JiraController {
  constructor(
    private readonly jiraService: JiraService,
    private readonly coreService: CoreService,
  ) {}
  @Post()
  public async getHook(@Body() body) {
    console.log(body.worklog)
    const issue = await this.jiraService.findIssue(body.worklog.issueId);

    const assigneeData = new Assignee(body.worklog, issue);

    await this.coreService.handleNewRecord(assigneeData);
  }
}
