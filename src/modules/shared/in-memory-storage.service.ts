import { Injectable } from '@nestjs/common';
import * as Client from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { UserRedisData } from '../../common/dto/user-redis-data.dto';
import { RedisKeys } from '../../common/enums/redis-keys.enum';
import { UserSheetsIndexes } from '../../common/types/user-sheets-indexes.type';

@Injectable()
export class InMemoryStorageService {
  private readonly ioClient: Client.Redis;

  constructor(private readonly redisService: RedisService) {
    this.ioClient = this.redisService.getClient();
  }

  public async addNamespaceToHash(namespace: string): Promise<void> {
    await this.ioClient.hset(
      RedisKeys.namespaces,
      namespace,
      'Use only fields',
    );
  }

  //change return
  public async isNamespaceInHash(namespace: string): Promise<boolean> {
    const isExist = await this.ioClient.hexists(
      RedisKeys.namespaces,
      namespace,
    );

    console.log('isExist:', isExist);

    return !!isExist;
  }

  public async addUserToHash(userData: UserRedisData): Promise<void> {
    const key = this._generateKeyByPattern(
      userData.namespace,
      userData.userName,
    );

    await this.ioClient.hset(
      key,
      userData.userName,
      JSON.stringify(userData.sheetsValues),
    );
  }

  public async isUserExists(
    namespace: string,
    userName: string,
  ): Promise<boolean> {
    const key = this._generateKeyByPattern(namespace, userName);

    const isKeyExist = await this.ioClient.exists(key);

    if (isKeyExist == 0) {
      return false;
    }
    return true;
  }

  public async getUserIndexes(
    userData: UserRedisData,
  ): Promise<UserSheetsIndexes> {
    const key = this._generateKeyByPattern(
      userData.namespace,
      userData.userName,
    );

    const data = await this.ioClient.hget(key, userData.userName);

    const parsedData = JSON.parse(data) as UserSheetsIndexes;

    return parsedData;
  }

  public async setLastIndexInNamespace(
    namespace: string,
    index: number,
  ): Promise<void> {
    await this.ioClient.hmset(namespace, RedisKeys.index, index);
  }

  public async getLastIndexInNamespace(namespace: string): Promise<number> {
    const index = await this.ioClient.hget(namespace, RedisKeys.index);

    return +index;
  }

  private _generateKeyByPattern(value1: string, value2: string): string {
    return `${value1}:${value2}`;
  }
}
