import { Injectable } from '@nestjs/common';
import * as config from 'config';

import { GoogleAuthConfig } from '../../common/types/google-auth-config.type';
import { JiraConfig } from '../../common/types/jira-config.type';
import { RedisConfig } from '../../common/types/redis-config.type';

@Injectable()
export class ConfigService {
  private readonly _config: config.IConfig = config;

  public get<T>(key: string): T {
    return this._config.get<T>(key);
  }

  public get redisConfig(): RedisConfig {
    console.log(this.get('redis.host'), this.get<number>('redis.port'), this.get('redis.password'), this.get('redis.uri'))
    return {
      host: this.get('redis.host'),
      port: this.get<number>('redis.port'),
      password: this.get('redis.password'),
      url: this.get('redis.url'),
    };
  }

  public get googleAuthConfig(): GoogleAuthConfig {
    return {
      clientEmail: this.get('google.client_email'),
      keyFile: null,
      privateKey: this.get('google.private_key'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
      ],
    };
  }

  public get jiraConfig(): JiraConfig {
    return {
      protocol: 'https',
      host: 'prommoto.atlassian.net',
      username: 'vladyslav.toloknov@gmail.com',
      password: 'CCoW8QsYu40O9VtdJ5Gu7298',
      apiVersion: '2',
      strictSSL: true,
    };
  }
}
