import { CoreService } from '../core/core.service';
import { JiraService } from './jira.service';
export declare class JiraController {
    private readonly jiraService;
    private readonly coreService;
    constructor(jiraService: JiraService, coreService: CoreService);
    getHook(body: any): Promise<void>;
}
