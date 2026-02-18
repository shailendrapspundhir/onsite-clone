import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { ApplicationStatus } from '@onsite360/types';
import { Job } from '../../job/entities/job.entity';

registerEnumType(ApplicationStatus, { name: 'ApplicationStatus' });

@ObjectType()
export class JobApplication {
  @Field()
  id!: string;

  @Field()
  jobId!: string;

  job?: Job;

  @Field()
  workerId!: string;

  @Field(() => String)
  status: ApplicationStatus = ApplicationStatus.PENDING;

  @Field({ nullable: true })
  coverMessage?: string;

  @Field({ nullable: true })
  employerNotes?: string;

  @Field()
  appliedAt!: Date;

  @Field()
  updatedAt!: Date;
}
