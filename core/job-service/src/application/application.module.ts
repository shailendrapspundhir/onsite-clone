import { Module } from '@nestjs/common';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from './application.service';
import { JobModule } from '../job/job.module';
import { InMemoryDatabaseModule } from '../in-memory-database/in-memory-database.module';

@Module({
  imports: [
    InMemoryDatabaseModule,
    JobModule,
  ],
  providers: [ApplicationResolver, ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
