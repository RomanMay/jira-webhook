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
exports.GoogleService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const config_service_1 = require("../shared/config.service");
let GoogleService = class GoogleService {
    constructor(configService) {
        this.configService = configService;
        this.sheets = googleapis_1.google.sheets('v4');
        this.init(this.configService.googleAuthConfig);
    }
    init(config) {
        this.jwtClient = new googleapis_1.google.auth.JWT(config.clientEmail, config.keyFile, config.privateKey, config.scopes);
        this.jwtClient.authorize();
    }
    async createTemplate(userData) {
        const firstLetter = this._convertIndexToLetter(userData.sheetsValues.firstRangeIndex);
        const lastLetter = this._convertIndexToLetter(userData.sheetsValues.firstRangeIndex + 5);
        await this.sheets.spreadsheets.values.append({
            auth: this.jwtClient,
            spreadsheetId: this.configService.get('google.spreadsheetId'),
            range: `${userData.namespace}!${firstLetter}:${lastLetter}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                majorDimension: 'ROWS',
                range: `${userData.namespace}!${firstLetter}:${lastLetter}`,
                values: [
                    [null, null, `${userData.name}`, null, 'Rate', '$1.00'],
                    [
                        'Project',
                        'Sprint',
                        'Task ID',
                        'Summary',
                        'Time Spent (h)',
                        'DateLogged',
                    ],
                ],
            },
        });
        const sheetId = await this._getSheetId(userData);
        await this.sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.configService.get('google.spreadsheetId'),
            auth: this.jwtClient,
            requestBody: {
                requests: [
                    {
                        updateBorders: {
                            range: {
                                sheetId: sheetId,
                                startRowIndex: 0,
                                endRowIndex: 2,
                                startColumnIndex: userData.sheetsValues.firstRangeIndex,
                                endColumnIndex: userData.sheetsValues.firstRangeIndex + 6,
                            },
                            bottom: {
                                style: 'SOLID',
                                width: 10,
                                color: {
                                    blue: 1.0,
                                },
                            },
                        },
                    },
                ],
            },
        });
    }
    async createNewSheet(namespace) {
        await this.sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.configService.get('google.spreadsheetId'),
            auth: this.jwtClient,
            requestBody: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: namespace,
                            },
                        },
                    },
                ],
            },
        });
    }
    async write(assignee) {
        const firstLetter = this._convertIndexToLetter(assignee.owner.sheetsValues.firstRangeIndex);
        const lastLetter = this._convertIndexToLetter(assignee.owner.sheetsValues.firstRangeIndex + 5);
        await this.sheets.spreadsheets.values.update({
            auth: this.jwtClient,
            spreadsheetId: this.configService.get('google.spreadsheetId'),
            range: `${assignee.owner.namespace}!${firstLetter + assignee.owner.sheetsValues.lastColumnIndex}:${lastLetter + assignee.owner.sheetsValues.lastColumnIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [
                        assignee.task.project,
                        assignee.task.sprint,
                        assignee.task.taskId,
                        assignee.task.summary,
                        assignee.task.timeSpent,
                        assignee.task.dateLogged,
                    ],
                ],
            },
        });
    }
    async _getSheetId(userData) {
        const get = await this.sheets.spreadsheets.get({
            auth: this.jwtClient,
            spreadsheetId: this.configService.get('google.spreadsheetId'),
            ranges: [`${userData.namespace}!A1:C1`],
        });
        return get.data.sheets[0].properties.sheetId;
    }
    _convertIndexToLetter(number) {
        const a = Math.floor(number / 26);
        if (a < 0) {
            return '';
        }
        return (this._convertIndexToLetter(a - 1) +
            String.fromCharCode(65 + (number % 26)));
    }
};
GoogleService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], GoogleService);
exports.GoogleService = GoogleService;
//# sourceMappingURL=google.service.js.map