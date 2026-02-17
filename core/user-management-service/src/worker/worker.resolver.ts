import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorkerProfile } from './entities/worker-profile.entity';
import { WorkerService } from './worker.service';
import { CreateWorkerProfileInput, UpdateWorkerProfileInput } from './dto/worker-profile.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { CurrentUserId } from '../decorators/current-user-id.decorator';
import { SchemaValidate } from '../decorators/schema-validate.decorator';

@Resolver(() => WorkerProfile)
export class WorkerResolver {
  constructor(private service: WorkerService) {}

  @Query(() => WorkerProfile, { nullable: true })
  async workerProfile(@Args('userId') userId: string): Promise<WorkerProfile | null> {
    return this.service.findByUserId(userId);
  }

  @Query(() => WorkerProfile)
  async workerProfileById(@Args('id') id: string): Promise<WorkerProfile> {
    return this.service.findById(id);
  }

  @Mutation(() => WorkerProfile)
  @SchemaValidate('user.workerProfile')
  async createWorkerProfile(
    @CurrentUserId() userId: string,
    @Args('input') input: CreateWorkerProfileInput,
  ): Promise<WorkerProfile> {
    return this.service.create(userId, input);
  }

  @Mutation(() => WorkerProfile)
  @UseGuards(GqlAuthGuard)
  async updateWorkerProfile(
    @CurrentUserId() userId: string,
    @Args('input') input: UpdateWorkerProfileInput,
  ): Promise<WorkerProfile> {
    return this.service.update(userId, input);
  }
}
