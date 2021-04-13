import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';

import { ConfigService } from '../shared/config.service';
import { tableTemplate, tableTemplate2 } from './templates/user-table-template';
import { GoogleAuthConfig } from '../../common/types/google-auth-config.type';
import { WriteData } from '../../common/dto/write-data.dto';
import { Assignee, UserRedisData1 } from '../../common/dto/user-redis-data.dto';
import { UserSheetsIndexes } from '../../common/types/user-sheets-indexes.type';

@Injectable()
export class GoogleService {
  private jwtClient: JWT;
  private sheets: sheets_v4.Sheets;
  private googleConfig: GoogleAuthConfig;

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

  public async createTemplate(userData: UserRedisData1): Promise<void> {
    const firstLetter = this.convert(userData.sheetsValues.firstRangeIndex);
    const lastLetter = this.convert(userData.sheetsValues.firstRangeIndex + 5);
    console.log('firstLetter:', firstLetter, lastLetter);

    // await this.sheets.spreadsheets.values.batchUpdate({
    //   auth: this.jwtClient,
    //   spreadsheetId: this.configService.get('google.spreadsheetId'),
    //   requestBody: {
    //     valueInputOption: 'USER_ENTERED',
    //     data: tableTemplate(
    //       userData.userName,
    //       `${userData.namespace}!${firstLetter}1:${lastLetter}1`,
    //       `${userData.namespace}!${firstLetter}2:${lastLetter}2`,
    //     ),
    //   },
    // });

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
    const firstLetter = this.convert(
      assignee.owner.sheetsValues.firstRangeIndex,
    );
    const lastLetter = this.convert(
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

  convert(number: number) {
    const a = Math.floor(number / 26);
    if (a < 0) {
      return '';
    }
    return this.convert(a - 1) + String.fromCharCode(65 + (number % 26));
  }
}
