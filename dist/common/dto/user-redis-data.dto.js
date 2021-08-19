"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignee = exports.UserData = exports.UserRedisData = void 0;
const write_data_dto_1 = require("./write-data.dto");
class UserRedisData {
    constructor(workLog) {
        this.namespace = workLog.self.split(/\/|[.]/)[2];
        this.name = workLog.updateAuthor.displayName;
    }
}
exports.UserRedisData = UserRedisData;
class UserData {
    constructor(workLog) {
        this.namespace = workLog.self.split(/\/|[.]/)[2];
        this.name = workLog.updateAuthor.displayName;
    }
}
exports.UserData = UserData;
class Assignee {
    constructor(workLog, issue) {
        this.owner = new UserRedisData(workLog);
        this.task = new write_data_dto_1.WriteData(workLog, issue);
    }
    get hasTemplate() {
        return !!this.owner.sheetsValues;
    }
}
exports.Assignee = Assignee;
//# sourceMappingURL=user-redis-data.dto.js.map