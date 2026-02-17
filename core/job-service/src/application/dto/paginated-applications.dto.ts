import { ObjectType, Field } from '@nestjs/graphql';
import { JobApplication } from '../entities/job-application.entity';

@ObjectType()
export class PaginatedApplications {
  @Field(() => [JobApplication])
  items: JobApplication[];

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
