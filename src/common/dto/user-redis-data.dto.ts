import JiraApi from 'jira-client';
import { UserSheetsIndexes } from '../types/user-sheets-indexes.type';
import { WriteData } from './write-data.dto';

export class UserRedisData {
  namespace: string;
  name: string;
  sheetsValues: UserSheetsIndexes;

  constructor(workLog: JiraApi.JsonResponse) {
    // split by dot and slash
    this.namespace = workLog.self.split(/\/|[.]/)[2];
    this.name = workLog.updateAuthor.displayName;
  }
}

export class UserData {
  namespace: string;
  name: string;

  constructor(workLog: JiraApi.JsonResponse) {
    // split by dot and slash
    this.namespace = workLog.self.split(/\/|[.]/)[2];
    this.name = workLog.updateAuthor.displayName;
  }
}

export class Assignee {
  owner: UserRedisData;
  task: WriteData;

  constructor(workLog: JiraApi.JsonResponse, issue: JiraApi.JsonResponse) {
    this.owner = new UserRedisData(workLog);
    this.task = new WriteData(workLog, issue);
  }

  public get hasTemplate(): boolean {
    return !!this.owner.sheetsValues;
  }
}
