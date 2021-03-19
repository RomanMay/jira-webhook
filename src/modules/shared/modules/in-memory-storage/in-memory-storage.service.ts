import { Injectable } from '@nestjs/common';
import * as Client from 'ioredis';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class InMemoryStorageService {
  private readonly ioClient: Client.Redis;

  constructor(private readonly redisService: RedisService) {
    this.ioClient = this.redisService.getClient();
  }

  public async addString(key: string, value = 'Use only keys'): Promise<void> {
    await this.ioClient.set(key, value);
  }
}
