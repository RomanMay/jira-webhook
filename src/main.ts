import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './modules/shared/services/config.service';
import { SharedModule } from './modules/shared/shared.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.select(SharedModule).get(ConfigService);

  await app.listen(configService.get('app.port'));
}
bootstrap();
