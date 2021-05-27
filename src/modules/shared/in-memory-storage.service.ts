import { Injectable } from '@nestjs/common';
import * as Client from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { UserData, UserRedisData } from '../../common/dto/user-redis-data.dto';
import { RedisKeys } from '../../common/enums/redis-keys.enum';
import { UserSheetsIndexes } from '../../common/types/user-sheets-indexes.type';

@Injectable()
export class InMemoryStorageService {
  private readonly ioClient: Client.Redis;

  constructor(private readonly redisService: RedisService) {
    this.ioClient = this.redisService.getClient();
  }

  public async addNamespaceToHash(namespace: string): Promise<void> {
    await this.ioClient.hset(RedisKeys.namespaces, namespace, 0);
  }

  public async isNamespaceInHash(namespace: string): Promise<boolean> {
    const isExist = await this.ioClient.hexists(
      RedisKeys.namespaces,
      namespace,
    );

    console.log('isExist:', isExist);

    return !!isExist;
  }

  public async addUserToHash(userData: UserRedisData): Promise<void> {
    const key = this._generateKeyByPattern(userData.namespace, userData.name);

    await this.ioClient.hset(
      key,
      userData.name,
      JSON.stringify(userData.sheetsValues),
    );
  }

  public async configureUserIndexes(
    user: UserRedisData,
  ): Promise<UserSheetsIndexes> {
    const permittedIndex = await this.getPermittedIndexInNamespace(
      user.namespace,
    );
    const indexes: UserSheetsIndexes = {
      firstRangeIndex: permittedIndex,
      lastColumnIndex: 2,
    };

    user.sheetsValues = indexes;

    await this.increasePermittedIndex(user);

    await this.addUserToHash(user);
    return indexes;
  }

  public async incrementUsersLastColumnIndex(
    user: UserRedisData,
  ): Promise<void> {
    user.sheetsValues.lastColumnIndex += 1;
    await this.addUserToHash(user);
  }

  public async isUserExists(user: UserData): Promise<boolean> {
    const key = this._generateKeyByPattern(user.namespace, user.name);

    const isKeyExist = await this.ioClient.exists(key);

    if (isKeyExist == 0) {
      return false;
    }
    return true;
  }

  public async getUserIndexes(user: UserData): Promise<UserSheetsIndexes> {
    const key = this._generateKeyByPattern(user.namespace, user.name);

    const data = await this.ioClient.hget(key, user.name);

    const parsedData = JSON.parse(data) as UserSheetsIndexes;

    return parsedData;
  }

  public async increasePermittedIndex(user: UserRedisData): Promise<void> {
    const permittedIndex = await this.getPermittedIndexInNamespace(
      user.namespace,
    );
    const increasedPermittedIndex = permittedIndex + 7;

    await this.setPermittedIndexInNamespace(
      user.namespace,
      increasedPermittedIndex,
    );
  }

  public async setPermittedIndexInNamespace(
    namespace: string,
    index: number,
  ): Promise<void> {
    await this.ioClient.hset(RedisKeys.namespaces, namespace, index);
  }

  public async getPermittedIndexInNamespace(
    namespace: string,
  ): Promise<number> {
    const index = await this.ioClient.hget(RedisKeys.namespaces, namespace);

    return +index;
  }

  public async addWorklogIdToSet(id: number): Promise<void> {
    await this.ioClient.sadd(RedisKeys.worklogIds, id);
  }

  public async isWorklogIdInSet(id: string): Promise<boolean> {
    const redis = await this.ioClient.sismember(RedisKeys.worklogIds, id);
    console.log('redis', !!redis);
    return !!redis;
  }

  private _generateKeyByPattern(value1: string, value2: string): string {
    return `${value1}:${value2}`;
  }
}
