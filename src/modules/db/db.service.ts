import { Injectable } from '@nestjs/common';

import { Assignee } from '../../common/dto/user-redis-data.dto';
import { WriteData } from '../../common/dto/write-data.dto';

import { NamespaceEntity } from '../../entities/namespace.entity';
import { RecordEntity } from '../../entities/record.entity';
import { UserEntity } from '../../entities/user.entity';

import { NamespaceRepository } from '../../repositories/namespace.repository';
import { RecordRepository } from '../../repositories/record.repository';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class DbService {
  constructor(
    private readonly namespaceRepository: NamespaceRepository,
    private readonly userRepository: UserRepository,
    private readonly recordRepository: RecordRepository,
  ) {}

  public async createAndSaveNamespace(
    namespace: string,
  ): Promise<NamespaceEntity> {
    return this.namespaceRepository.createAndSaveNamespace(namespace);
  }

  public async getUserByName(name: string): Promise<UserEntity> {
    return this.userRepository.getUserByName(name);
  }

  public async createAndSaveUserOnNamespace(
    user: UserEntity,
    assignee: Assignee,
  ): Promise<UserEntity> {
    const namespace = await this.namespaceRepository.getNamespaceByName(
      assignee.owner.namespace,
    );

    if (!user) {
      user = await this.userRepository.createAndSaveUser(assignee.owner.name);
    }
    namespace.users.push(user);

    await this.namespaceRepository.save(namespace);

    return user;
  }

  public async createAndSaveRecord(
    record: WriteData,
    user: UserEntity,
  ): Promise<RecordEntity> {
    return this.recordRepository.createAndSaveRecord(record, user);
  }
}
