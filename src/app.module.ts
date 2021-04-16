import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './modules/core/core.module';
import { GoogleModule } from './modules/google/google.module';
import { JiraModule } from './modules/jira/jira.module';
import { ConfigService } from './modules/shared/config.service';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    JiraModule,
    GoogleModule,
    SharedModule,
    CoreModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.typeormConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
