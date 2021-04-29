"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const config = require("config");
let ConfigService = class ConfigService {
    constructor() {
        this._config = config;
    }
    get(key) {
        return this._config.get(key);
    }
    get redisConfig() {
        return {
            host: this.get('redis.host'),
            port: this.get('redis.port'),
            password: this.get('redis.password'),
        };
    }
    get googleAuthConfig() {
        return {
            clientEmail: this.get('google.client_email'),
            keyFile: null,
            privateKey: this.get('google.private_key'),
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
            ],
        };
    }
    get jiraConfig() {
        return {
            protocol: 'https',
            host: this.get('jira.host'),
            username: this.get('jira.username'),
            password: this.get('jira.password'),
            apiVersion: '2',
            strictSSL: true,
        };
    }
};
ConfigService = __decorate([
    common_1.Injectable()
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map