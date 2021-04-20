import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SharedModule } from './modules/shared/shared.module';

import { ConfigService } from './modules/shared/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.select(SharedModule).get(ConfigService);
  app.enableCors();
  await app.listen(process.env.PORT || configService.get('app.port'));
}
bootstrap();
