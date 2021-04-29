import { GoogleAuthConfig } from '../../common/types/google-auth-config.type';
import { JiraConfig } from '../../common/types/jira-config.type';
import { RedisConfig } from '../../common/types/redis-config.type';
export declare class ConfigService {
    private readonly _config;
    get<T>(key: string): T;
    get redisConfig(): RedisConfig;
    get googleAuthConfig(): GoogleAuthConfig;
    get jiraConfig(): JiraConfig;
}
