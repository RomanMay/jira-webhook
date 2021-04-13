import { Body, Controller, Post } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller('webhook')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}
  @Post()
  public async getHook(@Body() body) {
    await this.coreService.jira(body.worklog);
  }
}
