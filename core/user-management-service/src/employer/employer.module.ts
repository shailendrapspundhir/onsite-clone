import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerProfile } from './entities/employer-profile.entity';
import { EmployerResolver } from './employer.resolver';
import { EmployerService } from './employer.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerProfile])],
  providers: [EmployerResolver, EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
