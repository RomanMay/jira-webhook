import JiraApi from 'jira-client';
import { UserSheetsIndexes } from '../types/user-redis-data.type';

export class UserRedisData {
  namespace: string;
  userName: string;
  sheetsValues: UserSheetsIndexes;

  constructor(
    workLog: JiraApi.JsonResponse,
    firstRangeIndex: number,
    lastColumnIndex: number,
  ) {
    // split by dot and slash
    this.namespace = workLog.self.split(/\/|[.]/)[2];
    this.userName = workLog.updateAuthor.displayName;
    this.sheetsValues.firstRangeIndex = firstRangeIndex;
    this.sheetsValues.lastColumnIndex = lastColumnIndex;
  }
}
