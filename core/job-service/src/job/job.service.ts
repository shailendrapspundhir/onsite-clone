import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Job } from './entities/job.entity';
import { JobStatus } from '@onsite360/types';
import { RedisService } from '../redis/redis.service';
import { buildPaginatedResult, normalizePagination } from '@onsite360/common';
import { CACHE_TTL_JOB_LISTING } from '@onsite360/types';
import type { CreateJobInput, UpdateJobInput, JobSearchInput } from './dto/job.input';
import { JobSearchSortBy, SortOrder } from './dto/job.input';
import type { PaginatedResult } from '@onsite360/types';
import { InMemoryDatabaseService } from '../in-memory-database/in-memory-database.service';

@Injectable()
export class JobService {
  constructor(
    private db: InMemoryDatabaseService,
    private redis: RedisService,
  ) {}

  get repo() { return this.db.getJobRepository(); }

  async create(employerId: string, input: CreateJobInput): Promise<Job> {
    const job = this.repo.create({
      employerId,
      title: input.title,
      description: input.description,
      role: input.role,
      employmentType: input.employmentType,
      location: input.location,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      salaryCurrency: input.salaryCurrency,
      salaryDisplay: input.salaryDisplay ?? false,
      requirements: input.requirements,
      benefits: input.benefits,
      status: JobStatus.DRAFT,
      closesAt: input.closesAt ? new Date(input.closesAt) : undefined,
    });
    return this.repo.save(job);
  }

  async update(employerId: string, jobId: string, input: UpdateJobInput): Promise<Job> {
    const job = await this.repo.findOne({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.employerId !== employerId) throw new ForbiddenException('Not authorized to update this job');

    Object.assign(job, {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.role !== undefined && { role: input.role }),
      ...(input.employmentType !== undefined && { employmentType: input.employmentType }),
      ...(input.location !== undefined && { location: input.location }),
      ...(input.salaryMin !== undefined && { salaryMin: input.salaryMin }),
      ...(input.salaryMax !== undefined && { salaryMax: input.salaryMax }),
      ...(input.salaryCurrency !== undefined && { salaryCurrency: input.salaryCurrency }),
      ...(input.salaryDisplay !== undefined && { salaryDisplay: input.salaryDisplay }),
      ...(input.requirements !== undefined && { requirements: input.requirements }),
      ...(input.benefits !== undefined && { benefits: input.benefits }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.closesAt !== undefined && { closesAt: new Date(input.closesAt) }),
    });
    if (input.status === JobStatus.PUBLISHED && !job.publishedAt) {
      job.publishedAt = new Date();
    }
    const saved = await this.repo.save(job);
    await this.invalidateListCache();
    return saved;
  }

  async findById(id: string): Promise<Job> {
    const cacheKey = `job:${id}`;
    const cached = await this.redis.get<Job>(cacheKey);
    if (cached) return cached as Job;

    const job = await this.repo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    await this.redis.set(cacheKey, job, CACHE_TTL_JOB_LISTING);
    return job;
  }

  async search(input: JobSearchInput): Promise<PaginatedResult<Job>> {
    const { page, pageSize, offset, limit } = normalizePagination({ page: input.page, pageSize: input.pageSize });
    const cacheKey = `jobs:search:${JSON.stringify({ ...input, page, pageSize })}`;
    const cached = await this.redis.get<PaginatedResult<Job>>(cacheKey);
    if (cached) return cached;

    const sortBy = input.sortBy ?? JobSearchSortBy.PUBLISHED_AT;
    const sortOrder = input.sortOrder ?? SortOrder.DESC;

    let jobs = this.repo.find().filter(job => job.status === JobStatus.PUBLISHED);

    if (input.query) {
      const q = input.query.toLowerCase();
      jobs = jobs.filter(job => job.title.toLowerCase().includes(q) || (job.description && job.description.toLowerCase().includes(q)));
    }
    if (input.role) jobs = jobs.filter(job => job.role === input.role);
    if (input.employmentType) jobs = jobs.filter(job => job.employmentType === input.employmentType);
    if (input.location) {
      const loc = input.location.toLowerCase();
      jobs = jobs.filter(job => job.location && job.location.toLowerCase().includes(loc));
    }
    if (input.minSalary != null) {
      const minSal = input.minSalary;
      jobs = jobs.filter(job => (job.salaryMax != null && job.salaryMax >= minSal) || (job.salaryMin != null && job.salaryMin >= minSal));
    }

    // Sort
    if (sortBy === JobSearchSortBy.TITLE) {
      jobs.sort((a, b) => sortOrder === SortOrder.ASC ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
    } else if (sortBy === JobSearchSortBy.CREATED_AT) {
      jobs.sort((a, b) => sortOrder === SortOrder.ASC ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      jobs.sort((a, b) => sortOrder === SortOrder.ASC ? (a.publishedAt?.getTime() ?? 0) - (b.publishedAt?.getTime() ?? 0) : (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
    }

    const items = jobs.slice(offset, offset + limit);
    const total = jobs.length;
    const result = buildPaginatedResult(items, total, page, pageSize);
    await this.redis.set(cacheKey, result, CACHE_TTL_JOB_LISTING);
    return result;
  }

  async findByEmployer(employerId: string, page?: number, pageSize?: number): Promise<PaginatedResult<Job>> {
    const { page: p, pageSize: ps, offset, limit } = normalizePagination({ page, pageSize });
    const [items, total] = await this.repo.findAndCount({
      where: { employerId },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
    return buildPaginatedResult(items, total, p, ps);
  }

  async publish(employerId: string, jobId: string): Promise<Job> {
    return this.update(employerId, jobId, { status: JobStatus.PUBLISHED });
  }

  async ensureEmployerOwns(employerId: string, jobId: string): Promise<Job> {
    const job = await this.repo.findOne({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.employerId !== employerId) throw new ForbiddenException('Not authorized');
    return job;
  }

  private async invalidateListCache(): Promise<void> {
    // In production you might use a pattern delete or tags; for simplicity we just let entries expire
  }
}
