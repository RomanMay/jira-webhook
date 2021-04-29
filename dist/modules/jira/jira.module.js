"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraModule = void 0;
const common_1 = require("@nestjs/common");
const core_module_1 = require("../core/core.module");
const google_module_1 = require("../google/google.module");
const shared_module_1 = require("../shared/shared.module");
const jira_controller_1 = require("./jira.controller");
const jira_service_1 = require("./jira.service");
let JiraModule = class JiraModule {
};
JiraModule = __decorate([
    common_1.Module({
        imports: [shared_module_1.SharedModule, google_module_1.GoogleModule, core_module_1.CoreModule],
        providers: [jira_service_1.JiraService],
        exports: [jira_service_1.JiraService],
        controllers: [jira_controller_1.JiraController],
    })
], JiraModule);
exports.JiraModule = JiraModule;
//# sourceMappingURL=jira.module.js.map