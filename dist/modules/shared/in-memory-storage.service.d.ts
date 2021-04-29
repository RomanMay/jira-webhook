import { RedisService } from 'nestjs-redis';
import { UserData, UserRedisData } from '../../common/dto/user-redis-data.dto';
import { UserSheetsIndexes } from '../../common/types/user-sheets-indexes.type';
export declare class InMemoryStorageService {
    private readonly redisService;
    private readonly ioClient;
    constructor(redisService: RedisService);
    addNamespaceToHash(namespace: string): Promise<void>;
    isNamespaceInHash(namespace: string): Promise<boolean>;
    addUserToHash(userData: UserRedisData): Promise<void>;
    configureUserIndexes(user: UserRedisData): Promise<UserSheetsIndexes>;
    incrementUsersLastColumnIndex(user: UserRedisData): Promise<void>;
    isUserExists(user: UserData): Promise<boolean>;
    getUserIndexes(user: UserData): Promise<UserSheetsIndexes>;
    increasePermittedIndex(user: UserRedisData): Promise<void>;
    setPermittedIndexInNamespace(namespace: string, index: number): Promise<void>;
    getPermittedIndexInNamespace(namespace: string): Promise<number>;
    private _generateKeyByPattern;
}
