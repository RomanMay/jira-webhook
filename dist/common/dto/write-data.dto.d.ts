import JiraApi from 'jira-client';
export declare class WriteData {
    project: string;
    sprint: string;
    taskId: string;
    summary: string;
    timeSpent: string;
    dateLogged: Date;
    constructor(workLog: JiraApi.JsonResponse, issue: JiraApi.JsonResponse);
}
