import { Assignee } from '../../common/dto/user-redis-data.dto';
import { GoogleService } from '../google/google.service';
import { InMemoryStorageService } from '../shared/in-memory-storage.service';
import { ReportOutput } from './record-output.service';
export declare class CoreService {
    private readonly googleService;
    private readonly recordOutput;
    private readonly inMemoryStorage;
    constructor(googleService: GoogleService, recordOutput: ReportOutput, inMemoryStorage: InMemoryStorageService);
    handleNewRecord(assignee: Assignee): Promise<void>;
    private _checkNamespace;
    private _createNamespace;
}
