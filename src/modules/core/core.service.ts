import { Injectable } from '@nestjs/common';

import { UserRedisData } from '../../common/dto/user-redis-data.dto';
import { WriteData } from '../../common/dto/write-data.dto';
import { UserSheetsIndexes } from '../../common/types/user-sheets-indexes.type';

import { GoogleService } from '../google/google.service';
import { JiraService } from '../jira/jira.service';
import { InMemoryStorageService } from '../shared/in-memory-storage.service';
import { ReportOutput } from './record-output.service';

@Injectable()
export class CoreService {
  constructor(
    private readonly jiraService: JiraService,
    private readonly googleService: GoogleService,
    private readonly recordOutput: ReportOutput,
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
      await this._createNamespace(userData, namespace);
      await this._createTemplate(userData, namespace);
    }

    if (!isUserExist && isNamespaceInHash) {
      const lastRangeIndex = await this.inMemoryStorage.getLastIndexInNamespace(
        namespace,
      );

      userData.sheetsValues.firstRangeIndex = lastRangeIndex + 7;

      await this._createTemplate(userData, namespace);
    }

    if (isUserExist && isNamespaceInHash) {
      const indexesFromStorage = await this.inMemoryStorage.getUserIndexes(
        userData,
      );

      userData.sheetsValues = indexesFromStorage;
      userData.sheetsValues.lastColumnIndex += 1;

      await this.inMemoryStorage.addUserToHash(userData);
    }

    await this.recordOutput.write(record, userData);
  }

  private async _createTemplate(
    userData: UserRedisData,
    namespace: string,
  ): Promise<void> {
    await this.googleService.createTemplate(userData);
    userData.sheetsValues.lastColumnIndex += 1;
    await this.inMemoryStorage.addUserToHash(userData);
    await this.inMemoryStorage.setLastIndexInNamespace(
      namespace,
      userData.sheetsValues.firstRangeIndex,
    );
  }

  private async _createNamespace(
    userData: UserRedisData,
    namespace: string,
  ): Promise<void> {
    await this.googleService.createNewSheet(userData);
    await this.inMemoryStorage.addNamespaceToHash(namespace);
  }
}
