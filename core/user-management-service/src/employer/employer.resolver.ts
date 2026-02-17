import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmployerProfile } from './entities/employer-profile.entity';
import { EmployerService } from './employer.service';
import { CreateEmployerProfileInput, UpdateEmployerProfileInput } from './dto/employer-profile.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { CurrentUserId } from '../decorators/current-user-id.decorator';
import { SchemaValidate } from '../decorators/schema-validate.decorator';

@Resolver(() => EmployerProfile)
export class EmployerResolver {
  constructor(private service: EmployerService) {}

  @Query(() => EmployerProfile, { nullable: true })
  async employerProfile(@Args('userId') userId: string): Promise<EmployerProfile | null> {
    return this.service.findByUserId(userId);
  }

  @Query(() => EmployerProfile)
  async employerProfileById(@Args('id') id: string): Promise<EmployerProfile> {
    return this.service.findById(id);
  }

  @Mutation(() => EmployerProfile)
  @UseGuards(GqlAuthGuard)
  @SchemaValidate('user.employerProfile')
  async createEmployerProfile(
    @CurrentUserId() userId: string,
    @Args('input') input: CreateEmployerProfileInput,
  ): Promise<EmployerProfile> {
    return this.service.create(userId, input);
  }

  @Mutation(() => EmployerProfile)
  @UseGuards(GqlAuthGuard)
  async updateEmployerProfile(
    @CurrentUserId() userId: string,
    @Args('input') input: UpdateEmployerProfileInput,
  ): Promise<EmployerProfile> {
    return this.service.update(userId, input);
  }
}
