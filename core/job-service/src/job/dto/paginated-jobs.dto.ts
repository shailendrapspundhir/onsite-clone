import { ObjectType, Field } from '@nestjs/graphql';
import { Job } from '../entities/job.entity';

@ObjectType()
export class PaginatedJobs {
  @Field(() => [Job])
  items: Job[];

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  pageSize: number;

  @Field()
  totalPages: number;

  @Field()
  hasNext: boolean;

  @Field()
  hasPrevious: boolean;
}
