import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { InMemoryStorageModule } from './modules/in-memory-storage/in-memory-storage.module';

@Global()
@Module({
  imports: [InMemoryStorageModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SharedModule {}
