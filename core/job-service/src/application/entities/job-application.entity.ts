import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { ApplicationStatus } from '@onsite360/types';
import { Job } from '../../job/entities/job.entity';

registerEnumType(ApplicationStatus, { name: 'ApplicationStatus' });

@ObjectType()
@Entity('job_applications')
export class JobApplication {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  jobId: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Field()
  @Column('uuid')
  workerId: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  coverMessage?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  employerNotes?: string;

  @Field()
  @CreateDateColumn()
  appliedAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
