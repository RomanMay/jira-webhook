"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraController = void 0;
const common_1 = require("@nestjs/common");
const user_redis_data_dto_1 = require("../../common/dto/user-redis-data.dto");
const core_service_1 = require("../core/core.service");
const jira_service_1 = require("./jira.service");
let JiraController = class JiraController {
    constructor(jiraService, coreService) {
        this.jiraService = jiraService;
        this.coreService = coreService;
    }
    async getHook(body) {
        console.log('body:', body);
        const issue = await this.jiraService.findIssue(body.worklog.issueId);
        const assigneeData = new user_redis_data_dto_1.Assignee(body.worklog, issue);
        await this.coreService.handleNewRecord(assigneeData);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JiraController.prototype, "getHook", null);
JiraController = __decorate([
    common_1.Controller('webhook'),
    __metadata("design:paramtypes", [jira_service_1.JiraService,
        core_service_1.CoreService])
], JiraController);
exports.JiraController = JiraController;
//# sourceMappingURL=jira.controller.js.map