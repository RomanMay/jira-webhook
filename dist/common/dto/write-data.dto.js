"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteData = void 0;
class WriteData {
    constructor(workLog, issue) {
        this.project = issue.fields.project.key;
        if (issue.fields.customfield_10020 !== null) {
            this.sprint = issue.fields.customfield_10020[0].name;
        }
        this.sprint = 'no sprint';
        this.summary = issue.fields.summary;
        this.taskId = `${issue.fields.issuetype.self.split('/r')[0]}/browse/${issue.key}`;
        this.dateLogged = issue.fields.updated.split('T')[0];
        this.timeSpent = workLog.timeSpent;
    }
}
exports.WriteData = WriteData;
//# sourceMappingURL=write-data.dto.js.map