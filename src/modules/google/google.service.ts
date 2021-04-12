import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { promisify } from 'util';
import { JWT } from 'google-auth-library';

import { ConfigService } from '../shared/config.service';
import { tableTemplate } from './templates/user-table-template';
import { GoogleAuthConfig } from '../../common/types/google-auth-config.type';

@Injectable()
export class GoogleService {
  private jwtClient: JWT;
  private sheets: sheets_v4.Sheets;
  private googleConfig: GoogleAuthConfig;

  constructor(private readonly configService: ConfigService) {
    this.sheets = google.sheets('v4');
    this.init(this.configService.googleAuthConfig)
  }

  private init(config: GoogleAuthConfig){
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

  convert(number: number)  {
     let a = Math.floor(number/26)

     if(a < 0 ) {
       throw new Error('wtf')
     }
     return this.convert(a-1) + String.fromCharCode(65+(number%26))
   }


  public async testWrite() {
    await this.jwtClient.authorize();

    // console.log('2', this.jwtClient);

    const test = await this.sheets.spreadsheets.values.update({
      auth: this.jwtClient,
      spreadsheetId: '1hWS0NlPHdqITo7IKR3_zIXDuniSjU3qzzgmKjZi_Xd8',
      range: 'PDB!A1:G1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['kek', 'kek', 'kek', 'kek', 'kek', 'kek', 'kek']],
      },
    });
    return test;
  }
}
