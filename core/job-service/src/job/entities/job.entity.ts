import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { JobStatus, JobRole, EmploymentType } from '@onsite360/types';

registerEnumType(JobStatus, { name: 'JobStatus' });
registerEnumType(JobRole, { name: 'JobRole' });
registerEnumType(EmploymentType, { name: 'EmploymentType' });

@ObjectType()
export class Job {
  @Field()
  id!: string;

  @Field()
  employerId!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => String)
  role!: JobRole;

  @Field(() => String)
  employmentType!: EmploymentType;

  @Field()
  location!: string;

  @Field({ nullable: true })
  salaryMin?: number;

  @Field({ nullable: true })
  salaryMax?: number;

  @Field({ nullable: true })
  salaryCurrency?: string;

  @Field({ nullable: true })
  salaryDisplay?: boolean;

  @Field(() => [String], { nullable: true })
  requirements?: string[];

  @Field(() => [String], { nullable: true })
  benefits?: string[];

  @Field(() => String)
  status: JobStatus = JobStatus.DRAFT;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field({ nullable: true })
  closesAt?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  applications?: unknown[];
}
