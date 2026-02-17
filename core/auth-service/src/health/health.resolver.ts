import { Resolver, Query } from '@nestjs/graphql';
import { HealthService } from './health.service';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class HealthResult {
  @Field()
  status: string;

  @Field()
  service: string;

  @Field()
  database: boolean;

  @Field()
  redis: boolean;
}

@Resolver()
export class HealthResolver {
  constructor(private healthService: HealthService) {}

  @Query(() => HealthResult, { name: 'health' })
  async health() {
    return this.healthService.check();
  }
}
