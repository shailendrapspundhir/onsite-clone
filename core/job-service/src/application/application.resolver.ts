import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { JobApplication } from './entities/job-application.entity';
import { ApplicationService } from './application.service';
import { CreateApplicationInput, UpdateApplicationStatusInput } from './dto/application.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { CurrentUserId } from '../decorators/current-user-id.decorator';
import { PaginatedApplications } from './dto/paginated-applications.dto';
import { SchemaValidate } from '../decorators/schema-validate.decorator';

@Resolver(() => JobApplication)
export class ApplicationResolver {
  constructor(private service: ApplicationService) {}

  @Mutation(() => JobApplication)
  @UseGuards(GqlAuthGuard)
  @SchemaValidate('job.application')
  async applyToJob(
    @CurrentUserId() workerId: string,
    @Args('input') input: CreateApplicationInput,
  ): Promise<JobApplication> {
    return this.service.apply(workerId, input.jobId, input.coverMessage);
  }

  @Mutation(() => JobApplication)
  @UseGuards(GqlAuthGuard)
  async updateApplicationStatus(
    @CurrentUserId() employerId: string,
    @Args('applicationId') applicationId: string,
    @Args('input') input: UpdateApplicationStatusInput,
  ): Promise<JobApplication> {
    return this.service.updateStatus(employerId, applicationId, input.status, input.employerNotes);
  }

  @Query(() => PaginatedApplications)
  @UseGuards(GqlAuthGuard)
  async applicationsForJob(
    @CurrentUserId() employerId: string,
    @Args('jobId') jobId: string,
    @Args('page', { nullable: true }) page?: number,
    @Args('pageSize', { nullable: true }) pageSize?: number,
  ): Promise<PaginatedApplications> {
    return this.service.findByJob(employerId, jobId, page, pageSize);
  }

  @Query(() => PaginatedApplications)
  @UseGuards(GqlAuthGuard)
  async myApplications(
    @CurrentUserId() workerId: string,
    @Args('page', { nullable: true }) page?: number,
    @Args('pageSize', { nullable: true }) pageSize?: number,
  ): Promise<PaginatedApplications> {
    return this.service.findByWorker(workerId, page, pageSize);
  }
}
