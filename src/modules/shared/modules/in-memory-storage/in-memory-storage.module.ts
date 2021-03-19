import { Global, Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { ConfigService } from '../../services/config.service';
import { InMemoryStorageService } from './in-memory-storage.service';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.redisConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [InMemoryStorageService],
  exports: [InMemoryStorageService],
})
export class InMemoryStorageModule {}
