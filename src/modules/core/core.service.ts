import { Injectable } from '@nestjs/common';

import { Assignee, UserRedisData1 } from '../../common/dto/user-redis-data.dto';
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

  public async jira(workLog) {
    const issue = await this.jiraService.findIssue(workLog.issueId);

    const assigneeData = new Assignee(workLog, issue);

    this.handleNewRecord(assigneeData);
  }

  public async handleNewRecord(assignee: Assignee): Promise<void> {
    await this._checkNamespace(assignee.owner.namespace);

    assignee.owner.sheetsValues = await this.inMemoryStorage.getUserIndexes(
      assignee.owner,
    );

    if (!assignee.hasTemplate) {
      assignee.owner.sheetsValues = await this.inMemoryStorage.configureUserIndexes(
        assignee.owner,
      );

      await this.googleService.createTemplate(assignee.owner);
    }

    //increment user's last column index
    await this.inMemoryStorage.incrementUsersLastColumnIndex(assignee.owner);

    await this.recordOutput.write(assignee);
  }

  private async _checkNamespace(namespace: string) {
    const isNamespaceInHash = await this.inMemoryStorage.isNamespaceInHash(
      namespace,
    );

    if (!isNamespaceInHash) {
      await this._createNamespace(namespace);
    }
  }

  // private async _createTemplate(
  //   userData: UserRedisData,
  //   namespace: string,
  // ): Promise<void> {
  //   await this.googleService.createTemplate(userData);
  //   userData.sheetsValues.lastColumnIndex += 1;
  //   await this.inMemoryStorage.addUserToHash(userData);
  //   await this.inMemoryStorage.setPermittedIndexInNamespace(
  //     namespace,
  //     userData.sheetsValues.firstRangeIndex,
  //   );
  // }

  private async _createNamespace(namespace: string): Promise<void> {
    await this.googleService.createNewSheet(namespace);
    await this.inMemoryStorage.addNamespaceToHash(namespace);
  }
}
