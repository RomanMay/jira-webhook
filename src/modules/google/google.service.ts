import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { google, sheets_v4 } from 'googleapis';
import { ConfigService } from '../shared/services/config.service';
import { template } from './templates/user-table-template';
import { JWT } from 'google-auth-library';
import { GoogleAuthConfig } from '../../common/types/google-auth-config.type';

@Injectable()
export class GoogleService {
  private jwtClient: JWT;
  private sheets: sheets_v4.Sheets;
  private googleConfig: GoogleAuthConfig;
  private promisifyBatchUpdate;
  private promisifyGet;

  constructor(private readonly configService: ConfigService) {
    this.sheets = google.sheets('v4');

    this.promisifyBatchUpdate = promisify(
      this.sheets.spreadsheets.values.batchUpdate,
    ).bind(this.sheets.spreadsheets.values);

    this.promisifyGet = promisify(this.sheets.spreadsheets.values.get).bind(
      this.sheets.spreadsheets.values,
    );

    this.googleConfig = this.configService.googleAuthConfig;

    this.jwtClient = new google.auth.JWT(
      this.googleConfig.clientEmail,
      this.googleConfig.keyFile,
      this.googleConfig.privateKey,
      this.googleConfig.scopes,
    );

    this.jwtClient.authorize();
    // this.authorize = promisify(this.jwtClient.authorize).bind(this.jwtClient);
  }

  public async createTemplate(name: string): Promise<void> {
    // console.log('success auth google', tokens);

    await this.promisifyBatchUpdate({
      auth: this.jwtClient,
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: template(name, 'PDB!A1:G1', 'PDB!A2:G2'),
      },
    });

    await this.promisifyBatchUpdate({
      auth: this.jwtClient,
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: template(name, 'PDB!I1:O1', 'PDB!I2:O2'),
      },
    });

    await this.promisifyBatchUpdate({
      auth: this.jwtClient,
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: template(name, 'PDB!Q1:W1', 'PDB!Q2:W2'),
      },
    });

    await this.promisifyBatchUpdate({
      auth: this.jwtClient,
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: template(name, 'PDB!Y1:AE1', 'PDB!Y2:AE2'),
      },
    });

    await this.promisifyBatchUpdate({
      auth: this.jwtClient,
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: template(name, 'PDB!AF1:AL1', 'PDB!AF2:AL2'),
      },
    });

    const info = await this.promisifyGet({
      auth: this.jwtClient,
      dateTimeRenderOption: 'FORMATTED_STRING',
      majorDimension: 'ROWS',
      spreadsheetId: '1hWS0NlPHdqITo7IKR3_zIXDuniSjU3qzzgmKjZi_Xd8',
      range: 'PDB!A1:O1',
    });
    console.log(info.data.values[0].length);
  }

  // public async testWrite() {
  //   await this.jwtClient.authorize();

  //   console.log('2', this.jwtClient);

  //   const test = await this.sheets.spreadsheets.values.update({
  //     auth: this.jwtClient,
  //     spreadsheetId: '1hWS0NlPHdqITo7IKR3_zIXDuniSjU3qzzgmKjZi_Xd8',
  //     range: 'PDB!A1:G1',
  //     valueInputOption: 'USER_ENTERED',
  //     requestBody: {
  //       values: [['kek', 'kek', 'kek', 'kek', 'kek', 'kek', 'kek']],
  //     },
  //   });
  //   return test;
  // }
}
