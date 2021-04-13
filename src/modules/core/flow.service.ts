import { Injectable } from '@nestjs/common';
import { UserRedisData } from '../../common/dto/user-redis-data.dto';
import { WriteData } from '../../common/dto/write-data.dto';
import { GoogleService } from '../google/google.service';
import { InMemoryStorageService } from '../shared/in-memory-storage.service';
import { ReportOutput } from './record-output.service';

@Injectable()
export class FlowService {
  constructor(
    private readonly recordOutput: ReportOutput,
    private readonly googleService: GoogleService,
    private readonly inMemoryStorage: InMemoryStorageService,
  ) {}

  public async namespaceNotExistFlow(
    userData: UserRedisData,
    record: WriteData,
    namespace: string,
  ): Promise<void> {
    await this.googleService.createNewSheet(userData);
    await this.inMemoryStorage.addNamespaceToHash(namespace);
    await this.googleService.createTemplate(userData);
    userData.sheetsValues.lastColumnIndex += 1;
    await this.inMemoryStorage.addUserToHash(userData);
    await this.inMemoryStorage.setLastIndexInNamespace(
      namespace,
      userData.sheetsValues.firstRangeIndex,
    );
    await this.recordOutput.write(record, userData);
  }

  public async userNotExistFlow(
    userData: UserRedisData,
    record: WriteData,
    namespace: string,
  ): Promise<void> {
    const lastRangeIndex = await this.inMemoryStorage.getLastIndexInNamespace(
      namespace,
    );
    userData.sheetsValues.firstRangeIndex = lastRangeIndex + 7;
    await this.googleService.createTemplate(userData);
    userData.sheetsValues.lastColumnIndex += 1;
    await this.inMemoryStorage.addUserToHash(userData);
    await this.inMemoryStorage.setLastIndexInNamespace(
      namespace,
      userData.sheetsValues.firstRangeIndex,
    );
    await this.recordOutput.write(record, userData);
  }

  public async commonFlow(
    userData: UserRedisData,
    record: WriteData,
  ): Promise<void> {
    const indexesFromStorage = await this.inMemoryStorage.getUserData(userData);
    userData.sheetsValues = indexesFromStorage;
    userData.sheetsValues.lastColumnIndex += 1;
    await this.inMemoryStorage.addUserToHash(userData);
    await this.recordOutput.write(record, userData);
  }
}
