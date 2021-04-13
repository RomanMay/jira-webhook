import JiraApi from 'jira-client';
import { UserSheetsIndexes } from '../types/user-sheets-indexes.type';
import { WriteData } from './write-data.dto';


export class UserRedisData1 {
  namespace: string;
  name: string;
  sheetsValues: UserSheetsIndexes;

  constructor(workLog: JiraApi.JsonResponse) {
    // console.log('firstRangeIndex:', sheetsValues);
    // split by dot and slash
    this.namespace = workLog.self.split(/\/|[.]/)[2];
    this.name = workLog.updateAuthor.displayName;
    // this.sheetsValues = sheetsValues;
  }
}

export class UserData {
  namespace: string;
  name: string;
  // sheetsValues: UserSheetsIndexes;

  constructor(workLog: JiraApi.JsonResponse) {
    // console.log('firstRangeIndex:', sheetsValues);
    // split by dot and slash
    this.namespace = workLog.self.split(/\/|[.]/)[2];
    this.name = workLog.updateAuthor.displayName;
    // this.sheetsValues = sheetsValues;
  }
}

export class Assignee {
  owner: UserRedisData1;
  task: WriteData;

  constructor(workLog: JiraApi.JsonResponse, issue: JiraApi.JsonResponse) {
    this.owner = new UserRedisData1(workLog);
    this.task = new WriteData(workLog, issue);
  }

  public get hasTemplate(): boolean {
    return !!this.owner.sheetsValues;
  }
}
