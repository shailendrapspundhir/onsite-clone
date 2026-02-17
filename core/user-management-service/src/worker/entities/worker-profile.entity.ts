import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { JobRole } from '@onsite360/types';

registerEnumType(JobRole, { name: 'JobRole' });

@ObjectType()
@Entity('worker_profiles')
export class WorkerProfile {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid', { unique: true })
  userId: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Field(() => [String])
  @Column('text', { default: '' })
  skillsStorage: string;

  @Field(() => [String])
  get skills(): string[] {
    return this.skillsStorage ? this.skillsStorage.split(',') : [];
  }
  set skills(v: string[]) {
    this.skillsStorage = Array.isArray(v) ? v.join(',') : '';
  }

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  experienceYears?: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field(() => [String], { nullable: true })
  @Column('text', { nullable: true })
  preferredLocationsStorage?: string;

  get preferredLocations(): string[] | undefined {
    return this.preferredLocationsStorage ? this.preferredLocationsStorage.split(',') : undefined;
  }
  set preferredLocations(v: string[] | undefined) {
    this.preferredLocationsStorage = v?.length ? v.join(',') : undefined;
  }

  @Field(() => [String], { nullable: true })
  @Column('text', { nullable: true })
  certificationsStorage?: string;

  get certifications(): string[] | undefined {
    return this.certificationsStorage ? this.certificationsStorage.split(',') : undefined;
  }
  set certifications(v: string[] | undefined) {
    this.certificationsStorage = v?.length ? v.join(',') : undefined;
  }

  @Field({ nullable: true })
  @Column({ nullable: true })
  resumeUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
