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
    private readonly recordOutput: ReportOutput,
    private readonly googleService: GoogleService,
    private readonly inMemoryStorage: InMemoryStorageService,
  ) {}
  public async handleNewRecord(workLog: any): Promise<void> {
    const issue = await this.jiraService.findIssue(workLog.issueId);
    // console.log('issue:', issue)

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
      await this.googleService.createNewSheet(userData);
      await this.inMemoryStorage.addNamespaceToHash(namespace);
      await this.googleService.createTemplate(userData);
      userData.sheetsValues.lastColumnIndex += 1;
      await this.inMemoryStorage.addUserToHash(userData);
      await this.inMemoryStorage.setLastIndexInNamespace(
        namespace,
        userData.sheetsValues.firstRangeIndex,
      );
      return await this.recordOutput.write(record, userData);
    }

    if (!isUserExist) {
      const lastRangeIndex = await this.inMemoryStorage.getLastIndexInNamespace(
        namespace,
      );
      userData.sheetsValues.firstRangeIndex = lastRangeIndex + 7;
      console.log(userData)
      await this.googleService.createTemplate(userData);
      userData.sheetsValues.lastColumnIndex += 1;
      await this.inMemoryStorage.addUserToHash(userData);
      await this.inMemoryStorage.setLastIndexInNamespace(
        namespace,
        userData.sheetsValues.firstRangeIndex,
      );
      return await this.recordOutput.write(record, userData);
    }

    const indexesFromStorage = await this.inMemoryStorage.getUserData(userData);
    userData.sheetsValues = indexesFromStorage;
    userData.sheetsValues.lastColumnIndex += 1;
    await this.inMemoryStorage.addUserToHash(userData);
    return await this.recordOutput.write(record, userData);
  }
}
