import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NamespaceRepository } from '../../repositories/namespace.repository';
import { RecordRepository } from '../../repositories/record.repository';
import { UserRepository } from '../../repositories/user.repository';
import { DbService } from './db.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      RecordRepository,
      NamespaceRepository,
    ]),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
