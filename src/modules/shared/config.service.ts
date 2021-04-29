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
    return {
      host: this.get('redis.host'),
      port: this.get<number>('redis.port'),
      password: this.get('redis.password'),
      // url: process.env.REDIS_URL,
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
      host: this.get('jira.host'),
      username: this.get('jira.username'),
      password: this.get('jira.password'),
      apiVersion: '2',
      strictSSL: true,
    };
  }
}
