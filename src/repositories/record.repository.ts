import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

import { WriteData } from '../common/dto/write-data.dto';
import { RecordEntity } from '../entities/record.entity';
import { UserEntity } from '../entities/user.entity';

@EntityRepository(RecordEntity)
export class RecordRepository extends BaseRepository<RecordEntity> {
  public async createAndSaveRecord(
    record: WriteData,
    user: UserEntity,
  ): Promise<RecordEntity> {
    const newRecord = new RecordEntity();

    newRecord.dateLogged = record.dateLogged;
    newRecord.project = record.project;
    newRecord.sprint = record.sprint;
    newRecord.summary = record.summary;
    newRecord.task = record.taskId;
    newRecord.timeSpent = record.timeSpent;
    newRecord.user = user;

    return this.save(newRecord);
  }
}
