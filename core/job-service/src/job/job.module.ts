import { Module } from '@nestjs/common';
import { JobResolver } from './job.resolver';
import { JobService } from './job.service';
import { InMemoryDatabaseModule } from '../in-memory-database/in-memory-database.module';

@Module({
  imports: [InMemoryDatabaseModule],
  providers: [JobResolver, JobService],
  exports: [JobService],
})
export class JobModule {}
