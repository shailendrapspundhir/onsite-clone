import { Module } from '@nestjs/common';
import { WorkerResolver } from './worker.resolver';
import { WorkerService } from './worker.service';
import { InMemoryDatabaseModule } from '../in-memory-database/in-memory-database.module';

@Module({
  imports: [InMemoryDatabaseModule],
  providers: [WorkerResolver, WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
