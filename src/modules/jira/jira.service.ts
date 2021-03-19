import { Injectable } from '@nestjs/common';
import * as JiraApi from 'jira-client';
import { ConfigService } from '../shared/services/config.service';

@Injectable()
export class JiraService {
  private jiraApi: JiraApi;
  constructor(private readonly configService: ConfigService) {
    this.jiraApi = new JiraApi(this.configService.jiraConfig);
  }

  public async findIssue(issueId) {
    return this.jiraApi.findIssue(issueId);
  }
}
