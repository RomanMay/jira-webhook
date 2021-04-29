import JiraApi from 'jira-client';
import { UserSheetsIndexes } from '../types/user-sheets-indexes.type';
import { WriteData } from './write-data.dto';
export declare class UserRedisData {
    namespace: string;
    name: string;
    sheetsValues: UserSheetsIndexes;
    constructor(workLog: JiraApi.JsonResponse);
}
export declare class UserData {
    namespace: string;
    name: string;
    constructor(workLog: JiraApi.JsonResponse);
}
export declare class Assignee {
    owner: UserRedisData;
    task: WriteData;
    constructor(workLog: JiraApi.JsonResponse, issue: JiraApi.JsonResponse);
    get hasTemplate(): boolean;
}
