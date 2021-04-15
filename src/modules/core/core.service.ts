import { Injectable } from '@nestjs/common';

import { Assignee } from '../../common/dto/user-redis-data.dto';

import { GoogleService } from '../google/google.service';
import { InMemoryStorageService } from '../shared/in-memory-storage.service';
import { ReportOutput } from './record-output.service';

@Injectable()
export class CoreService {
  constructor(
    private readonly googleService: GoogleService,
    private readonly recordOutput: ReportOutput,
    private readonly inMemoryStorage: InMemoryStorageService,
  ) {}

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

  private async _createNamespace(namespace: string): Promise<void> {
    await this.googleService.createNewSheet(namespace);
    await this.inMemoryStorage.addNamespaceToHash(namespace);
  }
}
