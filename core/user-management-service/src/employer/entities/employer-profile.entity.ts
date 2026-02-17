import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { JobRole } from '@onsite360/types';

registerEnumType(JobRole, { name: 'JobRole' });

@ObjectType()
@Entity('employer_profiles')
export class EmployerProfile {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid', { unique: true })
  userId: string;

  @Field()
  @Column()
  companyName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field()
  @Column()
  contactEmail: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactPhone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  logoUrl?: string;

  @Field(() => [String])
  @Column('text', { default: '' })
  desiredRolesStorage: string;

  get desiredRoles(): string[] {
    return this.desiredRolesStorage ? this.desiredRolesStorage.split(',') : [];
  }
  set desiredRoles(v: string[]) {
    this.desiredRolesStorage = Array.isArray(v) ? v.join(',') : '';
  }

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
