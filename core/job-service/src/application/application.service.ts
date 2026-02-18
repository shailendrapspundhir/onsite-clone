import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { JobApplication } from './entities/job-application.entity';
import { Job } from '../job/entities/job.entity';
import { ApplicationStatus, JobStatus } from '@onsite360/types';
import { JobService } from '../job/job.service';
import { buildPaginatedResult, normalizePagination } from '@onsite360/common';
import type { PaginatedResult } from '@onsite360/types';
import { InMemoryDatabaseService } from '../in-memory-database/in-memory-database.service';

@Injectable()
export class ApplicationService {
  constructor(
    private db: InMemoryDatabaseService,
    private jobService: JobService,
  ) {}

  get repo() { return this.db.getJobApplicationRepository(); }

  async apply(workerId: string, jobId: string, coverMessage?: string): Promise<JobApplication> {
    const job = await this.jobService.findById(jobId);
    if (job.status !== JobStatus.PUBLISHED) throw new ForbiddenException('Job is not open for applications');

    const existing = await this.repo.findOne({ where: { jobId, workerId } });
    if (existing) throw new ConflictException('Already applied to this job');

    const application = this.repo.create({
      jobId,
      workerId,
      coverMessage,
      status: ApplicationStatus.PENDING,
    });
    return this.repo.save(application);
  }

  async updateStatus(employerId: string, applicationId: string, status: ApplicationStatus, employerNotes?: string): Promise<JobApplication> {
    const application = await this.repo.findOne({ where: { id: applicationId } });
    if (!application) throw new NotFoundException('Application not found');
    const job: Job = await this.jobService.findById(application.jobId);
    application.job = job;
    if (job.employerId !== employerId) throw new ForbiddenException('Not authorized to update this application');

    application.status = status;
    if (employerNotes !== undefined) application.employerNotes = employerNotes;
    return this.repo.save(application);
  }

  /**
   * Withdraw application (worker-owned only; sets status to WITHDRAWN).
   * Enables worker to retract; employer can still see history.
   */
  async withdraw(workerId: string, applicationId: string): Promise<JobApplication> {
    const application = await this.repo.findOne({ where: { id: applicationId } });
    if (!application) throw new NotFoundException('Application not found');
    if (application.workerId !== workerId) throw new ForbiddenException('Not authorized to withdraw this application');

    // Prevent re-withdraw or invalid states
    if (application.status === ApplicationStatus.WITHDRAWN) {
      throw new ConflictException('Application already withdrawn');
    }

    application.status = ApplicationStatus.WITHDRAWN;
    return this.repo.save(application);
  }

  async findByJob(employerId: string, jobId: string, page?: number, pageSize?: number): Promise<PaginatedResult<JobApplication>> {
    await this.jobService.ensureEmployerOwns(employerId, jobId);
    const { page: p, pageSize: ps, offset, limit } = normalizePagination({ page, pageSize });
    const [items, total] = await this.repo.findAndCount({
      where: { jobId },
      order: { appliedAt: 'DESC' },
      skip: offset,
      take: limit,
    });
    return buildPaginatedResult(items, total, p, ps);
  }

  async findByWorker(workerId: string, page?: number, pageSize?: number): Promise<PaginatedResult<JobApplication>> {
    const { page: p, pageSize: ps, offset, limit } = normalizePagination({ page, pageSize });
    const [items, total] = await this.repo.findAndCount({
      where: { workerId },
      order: { appliedAt: 'DESC' },
      skip: offset,
      take: limit,
    });
    return buildPaginatedResult(items, total, p, ps);
  }
}
