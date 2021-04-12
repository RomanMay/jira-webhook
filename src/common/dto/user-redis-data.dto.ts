import JiraApi from 'jira-client';
import { UserSheetsIndexes } from '../types/user-sheets-indexes.type';

export class UserRedisData {
  namespace: string;
  userName: string;
  sheetsValues: UserSheetsIndexes;

  constructor(workLog: JiraApi.JsonResponse, sheetsValues: UserSheetsIndexes) {
    console.log('firstRangeIndex:', sheetsValues);
    // split by dot and slash
    this.namespace = workLog.self.split(/\/|[.]/)[2];
    this.userName = workLog.updateAuthor.displayName;
    this.sheetsValues = sheetsValues;
  }
}
