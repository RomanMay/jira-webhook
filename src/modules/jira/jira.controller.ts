import { Body, Controller, Post, Req } from '@nestjs/common';
import axios from 'axios';
import { РомаПидарас } from '../google/google.service';
import { JiraService } from './jira.service';

@Controller('webhook')
export class JiraController {
  constructor(
    private readonly jiraService: JiraService,
    private readonly googleService: РомаПидарас,
  ) {}
  @Post()
  public async getHook(@Body() body) {
    // console.log(body.worklog.issueId);
    const a = await this.jiraService.findIssue(body.worklog.issueId);
    // console.log(a.fields);
    // console.log('b:', a);
    // console.log(
    //   body.worklog.updateAuthor.displayName,
    //   body.worklog.created,
    //   a.fields.summary,
    //   a.fields.project.key,
    //   a.fields.customfield_10020[0].name,
    //   a.fields.updated,
    // );

    await this.googleService.createTemplate(
      body.worklog.updateAuthor.displayName,
      a.fields.project.key,
    );
  }
}
