import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { UserType } from '@onsite360/types';

registerEnumType(UserType, { name: 'UserType' });

@ObjectType()
@Entity('users')
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  phone?: string;

  @Field(() => UserType)
  @Column({ type: 'enum', enum: UserType })
  userType: UserType;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('Credential', 'user')
  credentials?: unknown[];

  @OneToMany('Session', 'user')
  sessions?: unknown[];
}
