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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreService = void 0;
const common_1 = require("@nestjs/common");
const google_service_1 = require("../google/google.service");
const in_memory_storage_service_1 = require("../shared/in-memory-storage.service");
const record_output_service_1 = require("./record-output.service");
let CoreService = class CoreService {
    constructor(googleService, recordOutput, inMemoryStorage) {
        this.googleService = googleService;
        this.recordOutput = recordOutput;
        this.inMemoryStorage = inMemoryStorage;
    }
    async handleNewRecord(assignee) {
        await this._checkNamespace(assignee.owner.namespace);
        assignee.owner.sheetsValues = await this.inMemoryStorage.getUserIndexes(assignee.owner);
        if (!assignee.hasTemplate) {
            assignee.owner.sheetsValues = await this.inMemoryStorage.configureUserIndexes(assignee.owner);
            await this.googleService.createTemplate(assignee.owner);
        }
        await this.inMemoryStorage.incrementUsersLastColumnIndex(assignee.owner);
        await this.recordOutput.write(assignee);
    }
    async _checkNamespace(namespace) {
        const isNamespaceInHash = await this.inMemoryStorage.isNamespaceInHash(namespace);
        if (!isNamespaceInHash) {
            await this._createNamespace(namespace);
        }
    }
    async _createNamespace(namespace) {
        await this.googleService.createNewSheet(namespace);
        await this.inMemoryStorage.addNamespaceToHash(namespace);
    }
};
CoreService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [google_service_1.GoogleService,
        record_output_service_1.ReportOutput,
        in_memory_storage_service_1.InMemoryStorageService])
], CoreService);
exports.CoreService = CoreService;
//# sourceMappingURL=core.service.js.map