import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerProfile } from './entities/worker-profile.entity';
import { WorkerResolver } from './worker.resolver';
import { WorkerService } from './worker.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkerProfile])],
  providers: [WorkerResolver, WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
