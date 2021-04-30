import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Assignee } from '../../common/dto/user-redis-data.dto';
import { CoreService } from '../core/core.service';
import { JiraService } from './jira.service';

@Controller('webhook')
export class JiraController {
  constructor(
    private readonly jiraService: JiraService,
    private readonly coreService: CoreService,
  ) {}

  @Get('ping')
  async ping(): Promise<string> {
    return 'pong';
  }

  @Post()
  public async getHook(@Body() body, @Req() req) {
    console.log('body:', body.workLog);
    console.log('body.issue:', body.issue);
    // const issue = await this.jiraService.findIssue(body.worklog.issueId);

    // // const assigneeData = new Assignee(body.worklog, body.issue);

    // await this.coreService.handleNewRecord(assigneeData);
  }
}
