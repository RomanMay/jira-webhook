import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { google, sheets_v4 } from 'googleapis';
import { ConfigService } from '../shared/services/config.service';
import { template } from './templates/user-table-template';
import * as key from '../../../config/google-key.json';
import { GoogleAuthConfig } from '../../common/types/google-auth-config.type';

@Injectable()
export class РомаПидарас {
  private jwtClient;
  private sheets: sheets_v4.Sheets;
  private googleConfig: GoogleAuthConfig;
  private promisifyBatchUpdate;
  private authorize;

  constructor(private readonly configService: ConfigService) {
    this.sheets = google.sheets('v4');

    this.promisifyBatchUpdate = promisify(
      this.sheets.spreadsheets.values.batchUpdate,
    ).bind(this.sheets.spreadsheets);

    this.googleConfig = this.configService.googleAuthConfig;

    console.log('google', this.googleConfig);

    this.jwtClient = new google.auth.JWT(
      this.googleConfig.clientEmail,
      this.googleConfig.keyFile,
      this.googleConfig.privateKey,
      this.googleConfig.scopes,
    );
    this.authorize = promisify(this.jwtClient.authorize).bind(this.jwtClient);
  }

  public async createTemplate(name: string, projectName: string) {
    await this.authorize();

    console.log(this.jwtClient);

    // console.log('success auth google', tokens);

    const value = await this.promisifyBatchUpdate({
      auth: this.jwtClient,
      spreadsheetId: this.configService.get('google.spreadsheetId'),
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        data: template(name, projectName),
      },
    });
    console.log('value:', value);
    return value;
  }
}
