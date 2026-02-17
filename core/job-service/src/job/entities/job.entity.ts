import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { JobStatus, JobRole, EmploymentType } from '@onsite360/types';

registerEnumType(JobStatus, { name: 'JobStatus' });
registerEnumType(JobRole, { name: 'JobRole' });
registerEnumType(EmploymentType, { name: 'EmploymentType' });

@ObjectType()
@Entity('jobs')
export class Job {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  employerId: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  description: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: JobRole })
  role: JobRole;

  @Field(() => String)
  @Column({ type: 'enum', enum: EmploymentType })
  employmentType: EmploymentType;

  @Field()
  @Column()
  location: string;

  @Field({ nullable: true })
  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  salaryMin?: number;

  @Field({ nullable: true })
  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  salaryMax?: number;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 3 })
  salaryCurrency?: string;

  @Field({ nullable: true })
  @Column({ default: false })
  salaryDisplay?: boolean;

  @Field(() => [String], { nullable: true })
  @Column('simple-json', { nullable: true })
  requirements?: string[];

  @Field(() => [String], { nullable: true })
  @Column('simple-json', { nullable: true })
  benefits?: string[];

  @Field(() => String)
  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.DRAFT })
  status: JobStatus;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  publishedAt?: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  closesAt?: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('JobApplication', 'job')
  applications?: unknown[];
}
