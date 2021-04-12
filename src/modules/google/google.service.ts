import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';

import { ConfigService } from '../shared/config.service';
import { tableTemplate } from './templates/user-table-template';
import { GoogleAuthConfig } from '../../common/types/google-auth-config.type';
import { WriteData } from '../../common/dto/write-data.dto';
import { UserRedisData } from '../../common/dto/user-redis-data.dto';
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

  public async createTemplate(userName: string): Promise<void> {
    await this.sheets.spreadsheets.values.batchUpdate({
      auth: this.jwtClient,
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: tableTemplate(userName, 'PDB!A1:G1', 'PDB!A2:G2'),
      },
    });

    // const info = await this.sheets.spreadsheets.values.get({
    //   auth: this.jwtClient,
    //   dateTimeRenderOption: 'FORMATTED_STRING',
    //   majorDimension: 'ROWS',
    //   spreadsheetId: '1hWS0NlPHdqITo7IKR3_zIXDuniSjU3qzzgmKjZi_Xd8',
    //   range: 'PDB!A1:O1',
    // });
    // console.log(info.data.values[0].length);
  }

  public async createNewSheet(userData: UserRedisData): Promise<void> {
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      auth: this.jwtClient,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: userData.namespace,
              },
            },
          },
        ],
      },
    });
  }

  public async write(record: WriteData, workLog: any) {

    const indexes: UserSheetsIndexes = {
      firstRangeIndex: 1,
      lastColumnIndex: 1,
    };

    const userData = new UserRedisData(workLog, indexes);
    console.log('userData:', userData);

    await this.createNewSheet(userData);

    // // console.log('2', this.jwtClient);

    // const test = await this.sheets.spreadsheets.values.update({
    //   auth: this.jwtClient,
    //   spreadsheetId: '1hWS0NlPHdqITo7IKR3_zIXDuniSjU3qzzgmKjZi_Xd8',
    //   range: 'PDB!A1:G1',
    //   valueInputOption: 'USER_ENTERED',
    //   requestBody: {
    //     values: [['kek', 'kek', 'kek', 'kek', 'kek', 'kek', 'kek']],
    //   },
    // });
    // return test;
  }

  convert(number: number) {
    const a = Math.floor(number / 26);

    return this.convert(a - 1) + String.fromCharCode(65 + (number % 26));
  }
}
