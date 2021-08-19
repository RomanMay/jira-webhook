import * as JiraApi from 'jira-client';
import { ConfigService } from '../shared/config.service';
export declare class JiraService {
    private readonly configService;
    private jiraApi;
    constructor(configService: ConfigService);
    findIssue(issueId: string): Promise<JiraApi.JsonResponse>;
}
