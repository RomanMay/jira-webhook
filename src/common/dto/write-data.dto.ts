import JiraApi from 'jira-client';

export class WriteData {
  project: string;
  sprint: string;
  taskId: string;
  summary: string;
  timeSpent: string;
  dateLogged: Date;

  constructor(workLog: JiraApi.JsonResponse, issue: JiraApi.JsonResponse) {
    this.project = issue.fields.project.key;
    this.sprint = issue.fields.customfield_10020[0].name;
    this.summary = issue.fields.summary;
    this.taskId = `${issue.fields.issuetype.self.split('/r')[0]}/browse/${
      issue.key
    }`;
    this.dateLogged = issue.fields.updated.split('T')[0];
    this.timeSpent = workLog.timeSpent;
  }
}
