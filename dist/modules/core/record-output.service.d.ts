import { Assignee } from '../../common/dto/user-redis-data.dto';
import { GoogleService } from '../google/google.service';
export declare class ReportOutput {
    private readonly googleService;
    constructor(googleService: GoogleService);
    write(assignee: Assignee): Promise<void>;
}
