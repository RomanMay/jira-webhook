import { ConfigService } from '../shared/config.service';
import { Assignee, UserRedisData } from '../../common/dto/user-redis-data.dto';
export declare class GoogleService {
    private readonly configService;
    private jwtClient;
    private sheets;
    constructor(configService: ConfigService);
    private init;
    createTemplate(userData: UserRedisData): Promise<void>;
    createNewSheet(namespace: string): Promise<void>;
    write(assignee: Assignee): Promise<void>;
    private _getSheetId;
    private _convertIndexToLetter;
}
