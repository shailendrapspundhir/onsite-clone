import { Module } from '@nestjs/common';
import { EmployerResolver } from './employer.resolver';
import { EmployerService } from './employer.service';
import { InMemoryDatabaseModule } from '../in-memory-database/in-memory-database.module';

@Module({
  imports: [InMemoryDatabaseModule],
  providers: [EmployerResolver, EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
