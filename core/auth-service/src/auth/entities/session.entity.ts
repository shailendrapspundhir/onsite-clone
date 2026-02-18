import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class Session {
  @Field()
  id!: string;

  userId!: string;

  user?: User;

  refreshTokenHash!: string;

  userAgent?: string;

  ipAddress?: string;

  expiresAt!: Date;

  @Field()
  createdAt!: Date;
}
