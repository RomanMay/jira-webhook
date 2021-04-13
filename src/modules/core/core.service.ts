import { Injectable } from '@nestjs/common';
import { UserRedisData } from '../../common/dto/user-redis-data.dto';
import { WriteData } from '../../common/dto/write-data.dto';
import { UserSheetsIndexes } from '../../common/types/user-sheets-indexes.type';
import { JiraService } from '../jira/jira.service';
import { InMemoryStorageService } from '../shared/in-memory-storage.service';
import { FlowService } from './flow.service';

@Injectable()
export class CoreService {
  constructor(
    private readonly jiraService: JiraService,
    private readonly flowService: FlowService,
    private readonly inMemoryStorage: InMemoryStorageService,
  ) {}
  public async handleNewRecord(workLog: any): Promise<void> {
    const issue = await this.jiraService.findIssue(workLog.issueId);

    const namespace: string = workLog.self.split(/\/|[.]/)[2];

    const userName: string = workLog.updateAuthor.displayName;

    const isNamespaceInHash = await this.inMemoryStorage.isNamespaceInHash(
      namespace,
    );

    const isUserExist = await this.inMemoryStorage.isUserExists(
      namespace,
      userName,
    );

    const record = new WriteData(workLog, issue);

    const indexes: UserSheetsIndexes = {
      firstRangeIndex: 0,
      lastColumnIndex: 2,
    };

    const userData = new UserRedisData(workLog, indexes);

    if (!isNamespaceInHash) {
      return this.flowService.namespaceNotExistFlow(
        userData,
        record,
        namespace,
      );
    }

    if (!isUserExist) {
      return this.flowService.userNotExistFlow(userData, record, namespace);
    }

    return this.flowService.commonFlow(userData, record);
  }
}
