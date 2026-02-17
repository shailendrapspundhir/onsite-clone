import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Job } from './entities/job.entity';
import { JobService } from './job.service';
import { CreateJobInput, UpdateJobInput, JobSearchInput } from './dto/job.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { CurrentUserId } from '../decorators/current-user-id.decorator';
import { PaginatedJobs } from './dto/paginated-jobs.dto';
import { SchemaValidate } from '../decorators/schema-validate.decorator';

@Resolver(() => Job)
export class JobResolver {
  constructor(private service: JobService) {}

  @Query(() => Job)
  async job(@Args('id') id: string): Promise<Job> {
    return this.service.findById(id);
  }

  @Query(() => PaginatedJobs)
  async jobsSearch(@Args('input') input: JobSearchInput): Promise<PaginatedJobs> {
    return this.service.search(input);
  }

  @Query(() => PaginatedJobs)
  @UseGuards(GqlAuthGuard)
  async myJobs(
    @CurrentUserId() userId: string,
    @Args('page', { nullable: true }) page?: number,
    @Args('pageSize', { nullable: true }) pageSize?: number,
  ): Promise<PaginatedJobs> {
    return this.service.findByEmployer(userId, page, pageSize);
  }

  @Mutation(() => Job)
  @UseGuards(GqlAuthGuard)
  @SchemaValidate('job.create')
  async createJob(
    @CurrentUserId() employerId: string,
    @Args('input') input: CreateJobInput,
  ): Promise<Job> {
    return this.service.create(employerId, input);
  }

  @Mutation(() => Job)
  @UseGuards(GqlAuthGuard)
  async updateJob(
    @CurrentUserId() employerId: string,
    @Args('id') jobId: string,
    @Args('input') input: UpdateJobInput,
  ): Promise<Job> {
    return this.service.update(employerId, jobId, input);
  }

  @Mutation(() => Job)
  @UseGuards(GqlAuthGuard)
  async publishJob(
    @CurrentUserId() employerId: string,
    @Args('id') jobId: string,
  ): Promise<Job> {
    return this.service.publish(employerId, jobId);
  }
}
