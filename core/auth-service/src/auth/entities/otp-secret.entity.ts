import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { OtpChannel } from '@onsite360/types';
import { User } from './user.entity';

registerEnumType(OtpChannel, { name: 'OtpChannel' });

@ObjectType()
@Entity('otp_secrets')
export class OtpSecret {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => OtpChannel)
  @Column({ type: 'enum', enum: OtpChannel })
  channel: OtpChannel;

  @Column()
  secret: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
