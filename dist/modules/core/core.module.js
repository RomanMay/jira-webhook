"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const google_module_1 = require("../google/google.module");
const shared_module_1 = require("../shared/shared.module");
const core_service_1 = require("./core.service");
const record_output_service_1 = require("./record-output.service");
let CoreModule = class CoreModule {
};
CoreModule = __decorate([
    common_1.Module({
        imports: [shared_module_1.SharedModule, google_module_1.GoogleModule],
        providers: [core_service_1.CoreService, record_output_service_1.ReportOutput],
        exports: [core_service_1.CoreService, record_output_service_1.ReportOutput],
    })
], CoreModule);
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map