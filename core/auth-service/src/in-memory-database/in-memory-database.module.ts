import { Module } from '@nestjs/common';
import { InMemoryDatabaseService } from './in-memory-database.service';

@Module({
  providers: [InMemoryDatabaseService],
  exports: [InMemoryDatabaseService],
})
export class InMemoryDatabaseModule {}