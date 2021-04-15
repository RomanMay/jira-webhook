import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';

import { ConfigService } from '../shared/config.service';
import { GoogleAuthConfig } from '../../common/types/google-auth-config.type';
import { Assignee, UserRedisData } from '../../common/dto/user-redis-data.dto';

@Injectable()
export class GoogleService {
  private jwtClient: JWT;
  private sheets: sheets_v4.Sheets;

  constructor(private readonly configService: ConfigService) {
    this.sheets = google.sheets('v4');
    this.init(this.configService.googleAuthConfig);
  }

  private init(config: GoogleAuthConfig) {
    this.jwtClient = new google.auth.JWT(
      config.clientEmail,
      config.keyFile,
      config.privateKey,
      config.scopes,
    );

    this.jwtClient.authorize();
  }

  public async createTemplate(userData: UserRedisData): Promise<void> {
    const firstLetter = this._convertIndexToLetter(
      userData.sheetsValues.firstRangeIndex,
    );
    const lastLetter = this._convertIndexToLetter(
      userData.sheetsValues.firstRangeIndex + 5,
    );

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

  public async createNewSheet(namespace: string): Promise<void> {
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

  public async write(assignee: Assignee) {
    const firstLetter = this._convertIndexToLetter(
      assignee.owner.sheetsValues.firstRangeIndex,
    );
    const lastLetter = this._convertIndexToLetter(
      assignee.owner.sheetsValues.firstRangeIndex + 5,
    );

    await this.sheets.spreadsheets.values.update({
      auth: this.jwtClient,
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      range: `${assignee.owner.namespace}!${
        firstLetter + assignee.owner.sheetsValues.lastColumnIndex
      }:${lastLetter + assignee.owner.sheetsValues.lastColumnIndex}`,
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

  private async _getSheetId(userData: UserRedisData): Promise<number> {
    const get = await this.sheets.spreadsheets.get({
      auth: this.jwtClient,
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      ranges: [`${userData.namespace}!A1:C1`],
    });

    return get.data.sheets[0].properties.sheetId;
  }

  private _convertIndexToLetter(number: number) {
    const a = Math.floor(number / 26);
    if (a < 0) {
      return '';
    }
    return (
      this._convertIndexToLetter(a - 1) +
      String.fromCharCode(65 + (number % 26))
    );
  }
}
